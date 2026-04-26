import { useNavigate } from 'react-router-dom'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import './TopicCard.css'

interface TopicCardProps {
    index: number
    title: string
    total: number
    completed: number
    isLocked: boolean
}

export function TopicCard({ index, title, total, completed, isLocked }: TopicCardProps) {
    const navigate = useNavigate()

    // calculate progress percentage
    const progress = (completed / total) * 100

    // check if topic is fully completed
    const isFullyCompleted = completed === total

    // handle navigate to topic
    const handleNavigate = () => {
        // if topic is not locked, navigate to topic
        if (!isLocked) {
            navigate(`/topico/${title.toLowerCase().replace(/\s+/g, '-')}`)
        }
    }

    return (
        <div
            className={`topic-card ${isFullyCompleted ? 'completed' : isLocked ? 'locked' : 'in-progress'}`}
            onClick={handleNavigate}
            style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
        >
            <div className="card-status-row">
                <span className="topic-tag">Módulo {index + 1}</span>
                <span className="status-icon">
                    {isFullyCompleted ? '✅' : isLocked ? '🔒' : '⚡'}
                </span>
            </div>

            <div className="card-content">
                <h3 className="topic-title">{title}</h3>
                {!isLocked ? (
                    <>
                        <div className="topic-info">
                            <span>{completed} de {total} concluídos</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <ProgressBar progress={progress} />
                    </>
                ) : (
                    <p className="locked-msg">Conclui os módulos anteriores para desbloquear</p>
                )}
            </div>

            <button className="topic-btn" disabled={isLocked}>
                {isLocked ? 'Bloqueado' : isFullyCompleted ? 'Rever Módulo' : 'Continuar'}
            </button>
        </div>
    )
}
