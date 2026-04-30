import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'
import { getChallenge, createSubmission, getChallengeSubmissions } from '../../services/api'
import type { Challenge, Submission } from '../../types'
import './ExercisePage.css'

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

    const [code, setCode] = useState('')
    const [status, setStatus] = useState<'todo' | 'passed' | 'failed'>('todo')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showFeedback, setShowFeedback] = useState(false)
    const [feedback, setFeedback] = useState('')
    const [terminalOutput, setTerminalOutput] = useState('')
    const [isRunning, setIsRunning] = useState(false)
    const [showTerminal, setShowTerminal] = useState(false)

    // Refs for scrolling sync
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const lineNumbersRef = useRef<HTMLDivElement>(null)

    // Sync line numbers scroll with textarea scroll
    const handleScroll = () => {
        if (textareaRef.current && lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
        }
    }

    // Calculate number of lines
    const lineCount = code.split('\n').length

    // Handle indentation and special keys like in VS Code
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const { selectionStart, selectionEnd, value } = e.currentTarget

        // Handle Tab key
        if (e.key === 'Tab') {
            e.preventDefault()
            const indent = '    ' // 4 spaces
            const before = value.substring(0, selectionStart)
            const after = value.substring(selectionEnd)
            
            setCode(before + indent + after)
            
            // Re-set cursor position after state update
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.selectionStart = textareaRef.current.selectionEnd = selectionStart + indent.length
                }
            }, 0)
        }

        // Handle Enter key (Auto-indent)
        if (e.key === 'Enter') {
            e.preventDefault()
            
            // Get current line indentation
            const lines = value.substring(0, selectionStart).split('\n')
            const currentLine = lines[lines.length - 1]
            const indentMatch = currentLine.match(/^\s*/)
            const indent = indentMatch ? indentMatch[0] : ''
            
            // If line ends with colon, add extra indent (standard for Python)
            const extraIndent = currentLine.trim().endsWith(':') ? '    ' : ''
            
            const before = value.substring(0, selectionStart)
            const after = value.substring(selectionEnd)
            const newText = before + '\n' + indent + extraIndent + after
            
            setCode(newText)
            
            // Re-set cursor position
            setTimeout(() => {
                if (textareaRef.current) {
                    const newPos = selectionStart + 1 + indent.length + extraIndent.length
                    textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newPos
                }
            }, 0)
        }
    }

    useEffect(() => {
        const controller = new AbortController()

        const fetchChallengeData = async () => {
            try {
                // Check if the exerciseId is valid
                if (!exerciseId) {
                    setError('ID do exercício não encontrado')
                    setIsLoading(false)
                    return
                }

                // Get the challenge and submissions data from the API
                // If submissions fail (e.g. 401), we default to empty array
                const [challengeRes, submissions] = await Promise.all([
                    getChallenge(exerciseId, { signal: controller.signal }).then(res => res.data),
                    getChallengeSubmissions(exerciseId, { signal: controller.signal })
                        .then(res => res.data)
                        .catch(err => {
                            console.warn('Submissões do exercício não carregadas:', err)
                            return []
                        })
                ])

                // If the request is not aborted, set the challenge and loading to false
                if (!controller.signal.aborted) {
                    const challengeData = challengeRes

                    // Check if any submission was successful
                    const isCompleted = submissions.some((s: Submission) => s.passed)

                    // Set the challenge with the completed status
                    setChallenge({ ...challengeData, completed: isCompleted })

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
        return () => controller.abort()
    }, [exerciseId])

    // Run Python code locally using Skulpt
    const handleRun = async () => {
        if (isRunning) return
        setIsRunning(true)
        setShowTerminal(true)
        setTerminalOutput('>>> A executar...\n')

        let output = ''

        // Configure Skulpt
        Sk.configure({
            output: (text: string) => { output += text },
            read: (filename: string) => {
                if (Sk.builtinFiles === undefined || Sk.builtinFiles['files'][filename] === undefined) {
                    throw new Error(`File not found: ${filename}`)
                }
                return Sk.builtinFiles['files'][filename]
            },
            inputfun: (prompt: string) => {
                return new Promise((resolve) => {
                    // 1. Ensure the prompt is printed to the terminal
                    if (prompt) setTerminalOutput(prev => prev + prompt);
                    
                    // 2. Small delay to allow React to render the output before prompt blocks
                    setTimeout(() => {
                        const result = window.prompt(prompt) || '';
                        // 3. Show the input in the terminal for a realistic feel
                        setTerminalOutput(prev => prev + result + '\n');
                        resolve(result);
                    }, 50);
                });
            },
            inputfunTakesPrompt: true,
        })

        try {
            setTerminalOutput('') // Start with clean terminal

            // 
            await Sk.misceval.asyncToPromise(() => {
                return Sk.importMainWithBody('<stdin>', false, code, true)
            })
            setTerminalOutput(output || '(sem output)\n')
        } catch (err: any) {
            setTerminalOutput(output + '\n❌ Erro: ' + err.toString())
        } finally {
            setIsRunning(false)
        }
    }

    const handleSubmeter = async () => {
        if (!exerciseId || isSubmitting) return

        setIsSubmitting(true)
        setShowFeedback(false) // Hide previous feedback

        try {
            // Create submission
            const response = await createSubmission(exerciseId, code)
            const result: Submission = response.data

            // Set status and feedback
            setStatus(result.passed ? 'passed' : 'failed')
            setFeedback(result.feedback)
            setShowFeedback(true)

            // Atualiza o estado local para marcar como concluído se passou
            if (result.passed && challenge) {
                setChallenge({ ...challenge, completed: true })
            }

            // Auto-scroll to feedback section
            setTimeout(() => {
                document.getElementById('ai-feedback')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                })
            }, 100)
        } catch (err) {
            console.error('Erro ao submeter:', err)
            alert('Ocorreu um erro ao submeter o exercício. Tenta novamente.')
        } finally {
            setIsSubmitting(false)
        }
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
                                <div className="line-numbers" ref={lineNumbersRef}>
                                    {Array.from({ length: Math.max(lineCount, 15) }).map((_, i) => (
                                        <span key={i}>{i + 1}</span>
                                    ))}
                                </div>
                                <textarea
                                    ref={textareaRef}
                                    className="code-textarea"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    onScroll={handleScroll}
                                    onKeyDown={handleKeyDown}
                                    spellCheck={false}
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
                            <button className="upload-btn">
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
                </div>
            </main>
            <Footer />
        </div>
    )
}
