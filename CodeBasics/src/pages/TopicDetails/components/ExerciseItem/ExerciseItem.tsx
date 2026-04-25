import { Link } from 'react-router-dom'
import './ExerciseItem.css'

interface ExerciseItemProps {
    id: string
    topicId: string
    index: number
    title: string
    status: 'completed' | 'in-progress' | 'todo'
    isLocked?: boolean
}

export function ExerciseItem({ id, topicId, index, title, status, isLocked }: ExerciseItemProps) {
    const getStatusIcon = (status: string) => {
        if (isLocked) return '🔒'
        switch (status) {
            case 'completed': return '✅'
            case 'in-progress': return '⚡'
            default: return '⚪'
        }
    }

    const getStatusLabel = (status: string) => {
        if (isLocked) return 'Bloqueado'
        switch (status) {
            case 'completed': return 'Concluído'
            case 'in-progress': return 'Próximo exercicio'
            default: return 'Por Fazer'
        }
    }

    const content = (
        <>
            <div className="exercise-number">
                {(index + 1).toString().padStart(2, '0')} 
            </div>
            <div className="exercise-info">
                <h3 className="exercise-title">{title}</h3>
                <span className={`exercise-status-tag ${isLocked ? 'locked' : status}`}>
                    {getStatusIcon(status)} {getStatusLabel(status)}
                </span>
            </div>
            <div className="exercise-arrow">
                {isLocked ? '' : '→'}
            </div>
        </>
    )

    if (isLocked) {
        return (
            <div className="exercise-item locked">
                {content}
            </div>
        )
    }

    return (
        <Link 
            to={`/topico/${topicId}/exercicio/${id}`} 
            className={`exercise-item ${status}`}
        >
            {content}
        </Link>
    )
}
