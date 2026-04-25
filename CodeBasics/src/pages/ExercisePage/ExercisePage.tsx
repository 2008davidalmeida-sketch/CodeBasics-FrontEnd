import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'
import './ExercisePage.css'

export default function ExercisePage() {
    const { topicId, exerciseId } = useParams()
    const [code, setCode] = useState('# Escreve o teu código Python aqui\n\ndef soma_pares(n):\n    # Teu código aqui\n    soma = 0\n    for i in range(1, n + 1):\n        if i % 2 == 0:\n            soma += i\n    return soma')
    const [status, setStatus] = useState<'todo' | 'passed' | 'failed'>('todo')
    const [showFeedback, setShowFeedback] = useState(false)

    const handleSubmeter = () => {
        // Simulação de submissão
        setStatus('passed')
        setShowFeedback(true)

        // Scroll to feedback de forma mais suave e contida
        setTimeout(() => {
            document.getElementById('ai-feedback')?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 100)
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
                            <h1>Exercício {exerciseId?.padStart(2, '0')} — Soma de Pares</h1>
                            <div className={`status-badge ${status}`}>
                                {status === 'passed' && 'Completo ✅'}
                                {status === 'failed' && 'Não passou ❌'}
                                {status === 'todo' && 'Por fazer'}
                            </div>
                        </div>

                        <div className="description-card">
                            <p>Cria uma função que recebe um número <code>n</code> e devolve a soma de todos os números pares de 1 até <code>n</code> (inclusive).</p>

                            <div className="example-box">
                                <h4>Exemplo esperado:</h4>
                                <pre className="code-example">
                                    <code>
                                        {`# Input: n = 6
# Output: 12 (porque 2 + 4 + 6 = 12)`}
                                    </code>
                                </pre>
                            </div>
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
                            </div>
                            <div className="editor-body">
                                <div className="line-numbers">
                                    {Array.from({ length: 20 }).map((_, i) => (
                                        <span key={i}>{i + 1}</span>
                                    ))}
                                </div>
                                <textarea
                                    className="code-textarea"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    spellCheck={false}
                                />
                            </div>
                        </div>

                        <div className="editor-actions">
                            <button className="upload-btn">
                                <span>📁</span> Carregar ficheiro .py
                            </button>
                            <button className="submit-btn" onClick={handleSubmeter}>
                                Submeter Exercício
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
                                    Excelente trabalho! Estás a progredir muito bem na lógica de ciclos e condições. 🚀
                                </p>
                            </div>

                            <div className="feedback-grid">
                                <div className="feedback-card good">
                                    <div className="card-icon">✅</div>
                                    <div className="card-content">
                                        <h3>O que está bem</h3>
                                        <p>A estrutura da função está correta e utilizaste nomes de variáveis claros que seguem as convenções do Python.</p>
                                    </div>
                                </div>
                                <div className="feedback-card improve">
                                    <div className="card-icon">🔧</div>
                                    <div className="card-content">
                                        <h3>O que pode ser melhorado</h3>
                                        <p>Poderias considerar usar uma list comprehension ou a função <code>sum()</code> com um gerador para tornar o código mais conciso.</p>
                                    </div>
                                </div>
                                <div className="feedback-card suggestion">
                                    <div className="card-icon">💡</div>
                                    <div className="card-content">
                                        <h3>Sugestão</h3>
                                        <p>Tenta resolver este mesmo problema usando <code>range(2, n + 1, 2)</code> para iterar apenas sobre os números pares.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
