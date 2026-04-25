import { ProgressBar } from '../../../Dashboard/components/ProgressBar/ProgressBar'
import './TopicHeader.css'

interface TopicHeaderProps {
    title: string
    description: string
    completedCount: number
    totalCount: number
}

export function TopicHeader({ title, description, completedCount, totalCount }: TopicHeaderProps) {
    const progressPercentage = (completedCount / totalCount) * 100

    return (
        <header className="topic-header-section">
            <div className="topic-header-info">
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            
            <div className="topic-progress-card">
                <div className="progress-stats">
                    <span>Progresso do Tópico</span>
                    <strong>{completedCount} de {totalCount} concluídos</strong>
                </div>
                <ProgressBar progress={progressPercentage} large />
            </div>
        </header>
    )
}
