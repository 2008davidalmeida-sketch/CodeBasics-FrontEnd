import { useState } from 'react'
import type { Challenge, Submission } from '../../../../types'

interface ChallengesAnalyticsProps {
    challenges: Challenge[];
    submissions: Submission[];
}

export function ChallengesAnalytics({ challenges, submissions }: ChallengesAnalyticsProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 6

    // Calculate stats for each challenge
    const challengeData = challenges.map(c => {
        const challengeSubs = submissions.filter(s => s.challengeId === c._id)
        const totalAttempts = challengeSubs.length
        const successes = challengeSubs.filter(s => s.passed).length
        const successRate = totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0

        return {
            ...c,
            totalAttempts,
            successes,
            successRate
        }
    })

    // Filter by search term
    const filteredChallenges = challengeData.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.topic.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => b.totalAttempts - a.totalAttempts) // Most attempted first

    const totalPages = Math.ceil(filteredChallenges.length / ITEMS_PER_PAGE)
    const paginatedChallenges = filteredChallenges.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    return (
        <div className="challenges-analytics">
            <div className="list-header">
                <h2>Desempenho por Exercício</h2>
                <div className="search-input-wrapper" style={{ maxWidth: '300px', marginTop: '2rem', marginBottom: '2.5rem' }}>
                    <input 
                        type="text" 
                        placeholder="Pesquisar por título ou tópico..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to first page on search
                        }}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="challenges-grid">
                {paginatedChallenges.map(c => (
                    <div key={c._id} className="challenge-stat-card">
                        <div className="challenge-stat-header">
                            <span className="challenge-topic">{c.topic}</span>
                            <h3>{c.title}</h3>
                        </div>
                        
                        <div className="challenge-stat-body">
                            <div className="stat-row">
                                <span>Tentativas:</span>
                                <strong>{c.totalAttempts}</strong>
                            </div>
                            <div className="stat-row">
                                <span>Sucessos:</span>
                                <strong className="success-text">{c.successes}</strong>
                            </div>
                            
                            <div className="success-rate-container">
                                <div className="rate-label">
                                    <span>Taxa de Sucesso:</span>
                                    <strong>{Math.round(c.successRate)}%</strong>
                                </div>
                                <div className="progress-bar-bg">
                                    <div 
                                        className="progress-bar-fill" 
                                        style={{ 
                                            width: `${c.successRate}%`,
                                            background: c.successRate > 70 ? '#3D8B2E' : c.successRate > 40 ? '#f59e0b' : '#ef4444'
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredChallenges.length === 0 && (
                    <div className="empty-state">
                        <p>Nenhum exercício encontrado com "{searchTerm}".</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="pagination-btn"
                    >
                        Anterior
                    </button>
                    <span className="page-info">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="pagination-btn"
                    >
                        Próximo
                    </button>
                </div>
            )}
        </div>
    )
}
