import { useState, useEffect } from 'react'
import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'
import { StatsCard } from './components/StatsCard/StatsCard'
import { TopicCard } from './components/TopicCard/TopicCard'
import { ProgressBar } from './components/ProgressBar/ProgressBar'
import { useAuth } from '../../context/AuthContext'
import { getChallenges, getMySubmissions } from '../../services/api'
import type { Challenge, Submission } from '../../types'
import './Dashboard.css'

// Interface for challenges from API ( extends Challenge interface and adds completed property)
interface DashboardChallenge extends Challenge {
    completed: boolean
    firstTry: boolean
}

export default function Dashboard() {
    const { user } = useAuth()

    const [challenges, setChallenges] = useState<DashboardChallenge[]>([])
    const [streak, setStreak] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // AbortController to prevent state updates after component unmounts
        const controller = new AbortController()

        const fetchChallenges = async () => {
            try {
                // fetch challenges and submissions in parallel
                // If submissions fail (e.g. 401), we default to empty array
                const [challengesRes, allSubmissions] = await Promise.all([
                    getChallenges({ signal: controller.signal }).then(res => res.data),
                    getMySubmissions({ signal: controller.signal })
                        .then(res => res.data.data)
                        .catch(err => {
                            console.warn('Submissões não carregadas (utilizador possivelmente não autenticado):', err)
                            return []
                        })
                ])

                if (!controller.signal.aborted) {
                    const allChallenges = challengesRes

                    // map challenges and check if completed and if completed at first try
                    const mappedChallenges = allChallenges.map((challenge: Challenge) => {
                        const challengeSubmissions = allSubmissions.filter((s: Submission) => {
                            const subId = (s.challengeId && typeof s.challengeId === 'object')
                                ? s.challengeId._id
                                : s.challengeId;
                            return String(subId) === String(challenge._id);
                        });

                        const hasPassed = challengeSubmissions.some((s: Submission) => s.passed === true);
                        const hasFailed = challengeSubmissions.some((s: Submission) => s.passed === false);

                        return {
                            ...challenge,
                            completed: hasPassed,
                            firstTry: hasPassed && !hasFailed
                        }
                    })

                    // Calculate Streak: consecutive first-try completions in order
                    const sorted = [...mappedChallenges].sort((a, b) => a.order - b.order);
                    let currentStreak = 0;
                    for (const ch of sorted) {
                        if (ch.completed) {
                            if (ch.firstTry) {
                                currentStreak++;
                            } else {
                                currentStreak = 0; // Reset streak on failure
                            }
                        }
                    }

                    setChallenges(mappedChallenges)
                    setStreak(currentStreak)
                    setIsLoading(false)
                }
            } catch (err) {
                // if component is still mounted, set error
                if (!controller.signal.aborted) {
                    console.error('Erro ao carregar desafios:', err)
                    setError('Não foi possível carregar os teus desafios.')
                    setIsLoading(false)
                }
            }
        }

        fetchChallenges()

        // cleanup function to abort the request
        return () => controller.abort()
    }, [])

    // Count of completed challenges
    const completedChallenges = challenges.filter(c => c.completed).length

    // Create an array of unique topics
    const uniqueTopics = Array.from(new Set(challenges.map(c => c.topic)))

    // Count total topics
    const totalTopics = uniqueTopics.length

    // Count completed topics
    const completedTopics = uniqueTopics.filter(topicName => {
        const topicChallenges = challenges.filter(c => c.topic === topicName)
        return topicChallenges.every(c => c.completed)
    }).length

    // Calculate topic progress percentage (prevent division by zero)
    const topicProgressPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0

    if (isLoading) {
        return (
            <div className="dashboard-page">
                <Header />
                <main className="dashboard-content">
                    <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <div className="loading-spinner"></div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (error) {
        return (
            <div className="dashboard-page">
                <Header />
                <main className="dashboard-content">
                    <div className="dashboard-container" style={{ textAlign: 'center', padding: '4rem' }}>
                        <h2 style={{ color: '#e11d48', marginBottom: '1rem' }}>Ups! Algo correu mal</h2>
                        <p style={{ color: '#64748b', marginBottom: '2rem' }}>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#3D8B2E',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Tentar Novamente
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    // Render the dashboard
    return (
        <div className="dashboard-page">
            <Header />
            <main className="dashboard-content">
                <div className="dashboard-container">
                    <header className="dashboard-header">
                        <div className="header-text">
                            <h1>Olá, <span className="text-accent">{user?.name || 'Explorador'}</span>! 👋</h1>
                            <p>Explora os tópicos baseados no programa da disciplina de API.</p>
                        </div>

                        <div className="overall-progress-card">
                            <div className="progress-info-row">
                                <span>Progresso dos Módulos</span>
                                <strong>{completedTopics} de {totalTopics} concluídos</strong>
                            </div>
                            <ProgressBar progress={topicProgressPercentage} large />
                        </div>
                    </header>

                    <div className="metrics-row">
                        <StatsCard
                            label="Exercícios Concluídos"
                            value={completedChallenges}
                            icon="🏆"
                        />
                        <StatsCard
                            label="Streak à Primeira"
                            value={streak}
                            icon="🔥"
                        />
                        <StatsCard
                            label="Total de Pontos"
                            value={completedChallenges * 150}
                            icon="💎"
                            accent
                        />
                    </div>

                    <section className="challenges-section">
                        <h2 className="section-title">Tópicos de Aprendizagem</h2>
                        <div className="challenges-grid">
                            {uniqueTopics.map((topicName, index) => {
                                const topicChallenges = challenges.filter(c => c.topic === topicName)
                                const total = topicChallenges.length
                                const completed = topicChallenges.filter(c => c.completed).length

                                // Logic for locking
                                const isLocked = index > 0 && !uniqueTopics.slice(0, index).every(prevName => {
                                    return challenges.filter(c => c.topic === prevName).every(c => c.completed)
                                })

                                return (
                                    <TopicCard
                                        key={topicName}
                                        index={index}
                                        title={topicName}
                                        total={total}
                                        completed={completed}
                                        isLocked={isLocked}
                                    />
                                )
                            })}
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}
