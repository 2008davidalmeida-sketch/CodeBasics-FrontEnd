import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'
import { TopicHeader } from './components/TopicHeader/TopicHeader'
import { ExerciseItem } from './components/ExerciseItem/ExerciseItem'
import { getChallenges, getMySubmissions } from '../../services/api'
import type { Challenge, Submission } from '../../types'
import './TopicDetails.css'

export default function TopicDetails() {
    const { id } = useParams()

    // Interface for challenges from API 
    interface DashboardChallenge extends Challenge {
        completed: boolean
    }

    const [challenges, setChallenges] = useState<DashboardChallenge[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const controller = new AbortController()

        const fetchData = async () => {
            try {
                // Get challenges and submissions from the API at the same time
                // If submissions fail, default to empty array
                const [challengesRes, allSubmissions] = await Promise.all([
                    getChallenges({ signal: controller.signal }).then(res => res.data),
                    getMySubmissions({ signal: controller.signal })
                        .then(res => res.data)
                        .catch(err => {
                            console.warn('Submissões não carregadas:', err)
                            return []
                        })
                ])
                
                // If the request is not aborted, set the challenge and loading to false
                if (!controller.signal.aborted) {
                    const allChallenges = challengesRes

                    // Filter challenges by topic id
                    const topicChallenges = allChallenges.filter((c: Challenge) => 
                        c.topic.toLowerCase().replace(/\s+/g, '-') === id
                    )

                    // challengeId vem populado do MongoDB (é um objeto, não uma string)
                    const mappedChallenges = topicChallenges.map((challenge: Challenge) => {
                        const hasPassed = allSubmissions.some((s: any) => {
                            const subId = typeof s.challengeId === 'object' ? s.challengeId._id : s.challengeId
                            return String(subId) === String(challenge._id) && s.passed
                        })
                        return { ...challenge, completed: hasPassed }
                    })

                    // Sort challenges by order
                    setChallenges(mappedChallenges.sort((a: DashboardChallenge, b: DashboardChallenge) => a.order - b.order))
                    setIsLoading(false)
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    console.error('Erro ao carregar tópico:', err)
                    setError('Não foi possível carregar os desafios deste tópico.')
                    setIsLoading(false)
                }
            }
        }

        fetchData()
        return () => controller.abort()
    }, [id])

    // Loading screen
    if (isLoading) {
        return (
            <div className="topic-details-page">
                <Header />
                <main className="topic-details-content" style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}>
                    <div className="loading-spinner"></div>
                </main>
                <Footer />
            </div>
        )
    }

    // Error screen
    if (error || challenges.length === 0) {
        return (
            <div className="topic-details-page">
                <Header />
                <main className="topic-details-content" style={{ textAlign: 'center', padding: '10rem' }}>
                    <h2>{error || 'Tópico não encontrado'}</h2>
                    <Link to="/dashboard" className="btn-home" style={{ marginTop: '2rem', display: 'inline-block', width: 'auto' }}>
                        Voltar ao Dashboard
                    </Link>
                </main>
                <Footer />
            </div>
        )
    }

    // Get the topic title and description from the first challenge
    const topicTitle = challenges[0].topic
    const topicDescription = `Aprende e domina todos os conceitos de ${topicTitle} através destes desafios práticos.`

    // Calculate completed exercises count
    const completedCount = challenges.filter(c => c.completed).length

    // Calculate total exercises count
    const totalCount = challenges.length

    // Render the topic details
    return (
        <div className="topic-details-page">
            <Header />
            <main className="topic-details-content">
                <div className="topic-details-container">
                    <Link to="/dashboard" className="back-link">
                        ← Voltar ao Dashboard
                    </Link>

                    <TopicHeader
                        title={topicTitle}
                        description={topicDescription}
                        completedCount={completedCount}
                        totalCount={totalCount}
                    />
                    <section className="exercises-list">
                        {challenges.map((exercise, index) => {
                            // Check if the exercise is completed
                            const isCompleted = exercise.completed

                            // Check if the previous exercise is completed
                            const isPreviousCompleted = index === 0 || challenges[index - 1].completed

                            // Set the status of the exercise
                            let status: 'completed' | 'in-progress' | 'todo' = 'todo'
                            if (isCompleted) status = 'completed'
                            else if (isPreviousCompleted) status = 'in-progress'

                            // Check if the exercise is locked
                            const isLocked = index > 0 && !challenges[index - 1].completed

                            return (
                                <ExerciseItem
                                    key={exercise._id}
                                    id={exercise._id}
                                    topicId={id || ''}
                                    index={index}
                                    title={exercise.title}
                                    status={status}
                                    isLocked={isLocked}
                                />
                            )
                        })}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}
