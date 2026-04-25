import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'
import { StatsCard } from './components/StatsCard/StatsCard'
import { TopicCard } from './components/TopicCard/TopicCard'
import { ProgressBar } from './components/ProgressBar/ProgressBar'
import { useAuth } from '../../context/AuthContext'
import './Dashboard.css'

export default function Dashboard() {
    const { user } = useAuth()

    // Mock data for challenges (will be replaced by API call later)
    const challenges = [
        { id: 1, title: 'Olá Mundo', topic: 'Básico', completed: true },
        { id: 2, title: 'Variáveis e Tipos', topic: 'Básico', completed: true },
        { id: 3, title: 'Operações Matemáticas', topic: 'Lógica', completed: true },
        { id: 4, title: 'Estruturas Condicionais', topic: 'Lógica', completed: false },
        { id: 5, title: 'Listas em Python', topic: 'Estruturas', completed: false },
        { id: 6, title: 'Loops While', topic: 'Iteração', completed: false },
        { id: 7, title: 'Loops For', topic: 'Iteração', completed: false },
        { id: 8, title: 'Funções I', topic: 'Modularização', completed: false },
    ]

    const completedChallenges = challenges.filter(c => c.completed).length
    
    // Topic-based progress
    const uniqueTopics = Array.from(new Set(challenges.map(c => c.topic)))
    const totalTopics = uniqueTopics.length
    const completedTopics = uniqueTopics.filter(topicName => {
        const topicChallenges = challenges.filter(c => c.topic === topicName)
        return topicChallenges.every(c => c.completed)
    }).length
    
    const topicProgressPercentage = (completedTopics / totalTopics) * 100

    return (
        <div className="dashboard-page">
            <Header />
            <main className="dashboard-content">
                <div className="dashboard-container">
                    <header className="dashboard-header">
                        <div className="header-text">
                            <h1>Bem-vindo, <span className="text-accent">{user?.name || 'Explorador'}</span>! 👋</h1>
                            <p>O teu caminho para mestre de Python começa aqui.</p>
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
                            label="Exercícios Superados" 
                            value={completedChallenges} 
                            icon="🏆" 
                        />
                        <StatsCard 
                            label="Dias de Ofensiva" 
                            value="3 Dias" 
                            icon="🔥" 
                        />
                        <StatsCard 
                            label="Total de XP" 
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
