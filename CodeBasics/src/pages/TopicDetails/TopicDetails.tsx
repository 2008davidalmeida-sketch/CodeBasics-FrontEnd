import { useParams, Link } from 'react-router-dom'
import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'
import { TopicHeader } from './components/TopicHeader/TopicHeader'
import { ExerciseItem } from './components/ExerciseItem/ExerciseItem'
import './TopicDetails.css'

export default function TopicDetails() {
    const { id } = useParams()

    // Mock data for the topic (in a real app, this would be fetched based on id)
    const topic = {
        id: id || '1',
        title: 'Básico de Python',
        description: 'Aprende os conceitos fundamentais da linguagem Python, desde a sintaxe básica até variáveis e tipos de dados.',
        exercises: [
            { id: '1', title: 'Olá Mundo', status: 'completed' as const },
            { id: '2', title: 'Variáveis e Tipos', status: 'completed' as const },
            { id: '3', title: 'Operações Matemáticas', status: 'in-progress' as const },
            { id: '4', title: 'Input de Usuário', status: 'todo' as const },
            { id: '5', title: 'Desafio: Calculadora', status: 'todo' as const },
        ]
    }

    // calculate completed exercises count
    const completedCount = topic.exercises.filter(ex => ex.status === 'completed').length
    // calculate total exercises count
    const totalCount = topic.exercises.length

    return (
        <div className="topic-details-page">
            <Header />
            <main className="topic-details-content">
                <div className="topic-details-container">
                    <Link to="/dashboard" className="back-link">
                        ← Voltar ao Dashboard
                    </Link>

                    <TopicHeader
                        title={topic.title}
                        description={topic.description}
                        completedCount={completedCount}
                        totalCount={totalCount}
                    />

                    <section className="exercises-section">
                        <h2 className="section-title">Exercícios</h2>
                        <div className="exercises-list">
                            {topic.exercises.map((exercise, index) => {
                                // An exercise is locked if it's not the first and the previous one is not completed
                                const isLocked = index > 0 && topic.exercises[index - 1].status !== 'completed';
                                
                                return (
                                    <ExerciseItem 
                                        key={exercise.id}
                                        id={exercise.id}
                                        topicId={id || '1'}
                                        index={index}
                                        title={exercise.title}
                                        status={exercise.status}
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
