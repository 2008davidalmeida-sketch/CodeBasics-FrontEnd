import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'
import { getChallenges, getChallenge, deleteSubmission, createSubmission, getChallengeSubmissions, getSubmission } from '../../services/api'
import type { Challenge, Submission } from '../../types'
import './ExercisePage.css'
import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'

// Skulpt is loaded globally via CDN in index.html
declare const Sk: any

interface LocalChallenge extends Challenge {
    completed?: boolean
}

export default function ExercisePage() {
    const { topicId, exerciseId } = useParams()
    const [challenge, setChallenge] = useState<LocalChallenge | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [nextChallengeId, setNextChallengeId] = useState<string | null>(null)

    const [code, setCode] = useState('')
    const [status, setStatus] = useState<'todo' | 'passed' | 'failed' | 'pending'>('todo')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showFeedback, setShowFeedback] = useState(false)
    const [feedback, setFeedback] = useState('')
    const [terminalOutput, setTerminalOutput] = useState('')
    const [isRunning, setIsRunning] = useState(false)
    const [showTerminal, setShowTerminal] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Handle code change from CodeMirror
    const handleCodeChange = useCallback((value: string) => {
        setCode(value)
    }, [])

    // Fetch challenge data when exerciseId changes
    useEffect(function () {
        const controller = new AbortController()

        async function fetchChallengeData() {
            try {
                // Check if the exerciseId is valid
                if (!exerciseId) {
                    setError('ID do exercício não encontrado')
                    setIsLoading(false)
                    return
                }

                // Get the challenge and submissions data from the API
                // If submissions fail (e.g. 401), we default to empty array
                const [challengeRes, submissions, allChallenges] = await Promise.all([
                    getChallenge(exerciseId, { signal: controller.signal })
                        .then(res => res.data),

                    getChallengeSubmissions(exerciseId, { signal: controller.signal })
                        .then(res => res.data.data)
                        .catch(err => {
                            console.warn('Submissões do exercício não carregadas:', err)
                            return []
                        }),

                    getChallenges({ signal: controller.signal })
                        .then(res => res.data)
                        .catch(err => {
                            console.warn('Desafios não carregados:', err)
                            return []
                        })
                ])

                // If the request is not aborted, set the challenge and loading to false
                if (!controller.signal.aborted) {
                    const challengeData = challengeRes

                    // Check if any submission was successful
                    const isCompleted = submissions.some(function (s: Submission) {
                        return s.passed === true;
                    });

                    // Find the next challenge in the same topic
                    if (allChallenges && allChallenges.length > 0) {
                        const currentTopic = challengeData.topic;
                        console.log('Finding next challenge for topic:', currentTopic);
                        
                        // Filter challenges by exact topic name from the current challenge
                        const topicChallenges = allChallenges.filter((c: Challenge) =>
                            c.topic === currentTopic
                        ).sort((a: Challenge, b: Challenge) => a.order - b.order);

                        console.log('Topic challenges found:', topicChallenges.length);

                        const currentIndex = topicChallenges.findIndex((c: Challenge) => String(c._id) === String(exerciseId));
                        console.log('Current exercise index:', currentIndex);

                        if (currentIndex !== -1 && currentIndex < topicChallenges.length - 1) {
                            const nextId = topicChallenges[currentIndex + 1]._id;
                            console.log('Next challenge ID set to:', nextId);
                            setNextChallengeId(nextId);
                        } else {
                            console.log('No next challenge found or it is the last one.');
                            setNextChallengeId(null);
                        }
                    }

                    // Set the challenge with the completed status
                    setChallenge({ ...challengeData, completed: isCompleted });

                    // If already completed, set the status as 'passed'
                    if (isCompleted) {
                        setStatus('passed')
                        // Opcional: Carregar o código da última submissão bem-sucedida
                        const lastPassed = [...submissions].reverse().find((s: Submission) => s.passed)
                        if (lastPassed) setCode(lastPassed.code)
                    } else {
                        setCode(challengeData.starterCode || '# Escreve o teu código Python aqui\n')
                    }

                    setIsLoading(false)
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    console.error('Erro ao carregar exercício:', err)
                    setError('Não foi possível carregar o exercício.')
                    setIsLoading(false)
                }
            }
        }

        fetchChallengeData()
        return function () {
            controller.abort()
        }
    }, [exerciseId])

    // Run Python code locally using Skulpt
    async function handleRun() {
        if (isRunning) return

        setIsRunning(true)
        setShowTerminal(true)
        setTerminalOutput('>>> A executar...\n')

        // Set the output to an empty string
        let output = ''

        // Configure Skulpt
        Sk.configure({
            output: function (text: string) { output += text },
            read: function (filename: string) {
                if (Sk.builtinFiles === undefined || Sk.builtinFiles['files'][filename] === undefined) {
                    throw new Error(`File not found: ${filename}`)
                }
                return Sk.builtinFiles['files'][filename]
            },
            // Configure input function to get input from the user
            inputfun: function (prompt: string) {
                return new Promise(function (resolve) {
                    // 1. Ensure the prompt is printed to the terminal
                    if (prompt) setTerminalOutput(prev => prev + prompt);

                    // 2. Small delay to allow React to render the output before prompt blocks
                    setTimeout(function () {
                        const result = window.prompt(prompt) || '';
                        // 3. Show the input in the terminal for a realistic feel
                        setTerminalOutput(prev => prev + result + '\n');
                        resolve(result);
                    }, 50);
                });
            },
            // The input function should take a prompt
            inputfunTakesPrompt: true,
        })

        try {
            setTerminalOutput('') // Start with clean terminal

            await Sk.misceval.asyncToPromise(function () {
                return Sk.importMainWithBody('<stdin>', false, code, true)
            })

            setTerminalOutput(output || '(sem output)\n')
        } catch (err: any) {
            setTerminalOutput(output + '\n❌ Erro: ' + err.toString())
        } finally {
            setIsRunning(false)
        }
    }

    async function pollSubmissionStatus(submissionId: string) {
        const pollInterval = 2000 // 2 seconds
        const maxAttempts = 30 // 1 minute timeout

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                const response = await getSubmission(submissionId)
                const submission: Submission = response.data

                if (submission.status === 'completed' || submission.status === 'failed') {
                    return submission
                }
            } catch (err) {
                console.error('Erro ao verificar status da submissão:', err)
            }
            await new Promise(resolve => setTimeout(resolve, pollInterval))
        }
        throw new Error('Tempo esgotado ao avaliar exercício.')
    }

    async function handleSubmeter() {
        if (!exerciseId || isSubmitting) return

        setIsSubmitting(true)
        setShowFeedback(false) // Hide previous feedback

        try {
            // 1. Create submission (returns pending status)
            const response = await createSubmission(exerciseId, code)
            const initialSubmission: Submission = response.data

            // 2. Poll for the final result
            const result = await pollSubmissionStatus(initialSubmission._id)

            // Throw an error if the result is not valid or feedback is missing
            if (!result || result.feedback === undefined || result.feedback === null) {
                await deleteSubmission(initialSubmission._id)
                throw new Error('Erro ao avaliar o exercício. Tenta novamente mais tarde.')
            }

            // 3. Set status and feedback
            const hasPassed = result.passed === true;
            setStatus(hasPassed ? 'passed' : 'failed')
            setFeedback(result.feedback || '')
            setShowFeedback(true)

            // Update local state to mark as completed if passed
            if (hasPassed && challenge) {
                setChallenge((prev) => {
                    if (!prev) return null;
                    return { ...prev, completed: true };
                });
            }

            // Auto-scroll to feedback section
            setTimeout(function () {
                document.getElementById('ai-feedback')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                })
            }, 100)
        } catch (err: any) {
            console.error('Erro ao submeter:', err)
            alert(err.message || 'Ocorreu um erro ao submeter o exercício. Tenta novamente.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        // if file is null, return
        if (!file) return

        // if file is not a Python file, return
        if (!file.name.endsWith('.py')) {
            alert('Por favor, carrega um ficheiro Python (.py)')
            event.target.value = ''
            return
        }

        // if file is bigger than 1MB, return
        const MAX_SIZE = 1 * 1024 * 1024 // 1MB
        if (file.size > MAX_SIZE) {
            alert('O ficheiro excede o limite de tamanho (1MB).')
            event.target.value = ''
            return
        }

        // Read the file and set the code
        const reader = new FileReader()
        reader.onload = (e) => {
            // if content is not a string, return
            const content = e.target?.result
            if (typeof content === 'string') {
                setCode(content)
            }
        }

        // Read the file
        reader.readAsText(file)

        // Clear the input value so that the same file can be selected again
        event.target.value = ''
    }

    if (isLoading) {
        return (
            <div className="exercise-page">
                <Header />
                <main className="exercise-content" style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}>
                    <div className="loading-spinner"></div>
                </main>
                <Footer />
            </div>
        )
    }

    if (error || !challenge) {
        return (
            <div className="exercise-page">
                <Header />
                <main className="exercise-content" style={{ textAlign: 'center', padding: '10rem' }}>
                    <h2>{error || 'Exercício não encontrado'}</h2>
                    <Link to={`/topico/${topicId}`} className="btn-home" style={{ marginTop: '2rem', display: 'inline-block', width: 'auto' }}>
                        Voltar ao tópico
                    </Link>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="exercise-page">
            <Header />
            <main className="exercise-content">
                <div className="exercise-container">
                    {/* 2. Header do Exercício */}
                    <div className="exercise-header-section">
                        <Link to={`/topico/${topicId}`} className="back-link">
                            ← Voltar ao tópico
                        </Link>

                        <div className="title-row">
                            <h1>Exercício {challenge.order.toString().padStart(2, '0')} — {challenge.title}</h1>
                            <div className={`status-badge ${status}`}>
                                {status === 'passed' && 'Completo ✅'}
                                {status === 'failed' && 'Não passou ❌'}
                                {status === 'todo' && 'Por fazer'}
                                {status === 'pending' && 'A avaliar... ⏳'}
                            </div>
                        </div>

                        <div className="description-card">
                            <p>{challenge.description}</p>
                        </div>
                    </div>

                    {/* 3. Editor de Código */}
                    <div className="editor-section">
                        <div className="editor-container">
                            <div className="editor-toolbar">
                                <div className="dots">
                                    <span className="dot red"></span>
                                    <span className="dot yellow"></span>
                                    <span className="dot green"></span>
                                </div>
                                <span className="filename">exercicio.py</span>
                                <button
                                    className="run-btn-small"
                                    onClick={handleRun}
                                    disabled={isRunning}
                                    title="Executar código (Ctrl+Enter)"
                                >
                                    {isRunning ? '⏳' : '▶ Executar'}
                                </button>
                            </div>
                            <div className="editor-body">
                                <CodeMirror
                                    value={code}
                                    height="450px"
                                    theme={oneDark}
                                    extensions={[python()]}
                                    onChange={handleCodeChange}
                                    className="codemirror-editor"
                                    basicSetup={{
                                        lineNumbers: true,
                                        foldGutter: true,
                                        dropCursor: true,
                                        allowMultipleSelections: true,
                                        indentOnInput: true,
                                        syntaxHighlighting: true,
                                        bracketMatching: true,
                                        closeBrackets: true,
                                        autocompletion: true,
                                        rectangularSelection: true,
                                        crosshairCursor: true,
                                        highlightActiveLine: true,
                                        highlightSelectionMatches: true,
                                        closeBracketsKeymap: true,
                                        defaultKeymap: true,
                                        searchKeymap: true,
                                        historyKeymap: true,
                                        foldKeymap: true,
                                        completionKeymap: true,
                                        lintKeymap: true,
                                    }}
                                />
                            </div>

                            {/* Integrated Terminal Panel */}
                            <div className={`integrated-terminal ${showTerminal ? 'open' : ''}`}>
                                <div className="terminal-header">
                                    <span className="terminal-title">TERMINAL</span>
                                    <button className="terminal-close-btn" onClick={() => setShowTerminal(false)}>✕</button>
                                </div>
                                <pre className="integrated-output">{terminalOutput}</pre>
                            </div>
                        </div>

                        <div className="editor-actions">
                            <input 
                                type="file" 
                                accept=".py" 
                                style={{ display: 'none' }} 
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                            />
                            <button className="upload-btn" onClick={() => fileInputRef.current?.click()}>
                                <span>📁</span> Carregar ficheiro .py
                            </button>
                            <button
                                className="submit-btn"
                                onClick={handleSubmeter}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'A avaliar...' : 'Submeter Exercício'}
                            </button>
                        </div>

                    </div>

                    {/* 4. Feedback da IA */}
                    {showFeedback && (
                        <div id="ai-feedback" className={`ai-feedback-section ${status}`}>
                            <div className="feedback-header">
                                <div className={`feedback-badge-large ${status}`}>
                                    {status === 'passed' ? 'Passou ✅' : 'Não passou ❌'}
                                </div>
                                <p className="encouragement-text">
                                    {status === 'passed'
                                        ? 'Excelente trabalho! Estás a progredir muito bem. 🚀'
                                        : 'Ainda não foi desta, mas não desistas! Vê as sugestões abaixo. 💪'}
                                </p>
                            </div>

                            <div className="feedback-grid">
                                {feedback.split('\n\n').filter(p => p.trim() !== '').map((part, index) => {
                                    const titles = ['O que está bem', 'O que pode ser melhorado', 'Sugestão']
                                    const icons = ['✅', '🔧', '💡']
                                    const classes = ['good', 'improve', 'suggestion']

                                    // Cicla pelos estilos se houver mais de 3 partes
                                    const styleIdx = index % 3

                                    return (
                                        <div key={index} className={`feedback-card ${classes[styleIdx]}`}>
                                            <div className="card-icon">{icons[styleIdx]}</div>
                                            <div className="card-content">
                                                <h3>{titles[styleIdx]}</h3>
                                                <p>{part.replace(/^###\s*|^[0-9]\.\s*/, '')}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                    {/* 5. Botão de Próximo Desafio */}
                    {status === 'passed' && nextChallengeId && challenge && (
                        <div className="next-challenge-container">
                            <Link 
                                to={`/topico/${challenge.topic.toLowerCase().replace(/\s+/g, '-')}/exercicio/${nextChallengeId}`} 
                                className="next-challenge-btn"
                            >
                                Próximo Desafio <span>→</span>
                            </Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
