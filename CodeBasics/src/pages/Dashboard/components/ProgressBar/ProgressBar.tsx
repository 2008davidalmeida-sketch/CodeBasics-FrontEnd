import './ProgressBar.css'

interface ProgressBarProps {
    progress: number
    large?: boolean
}

export function ProgressBar({ progress, large }: ProgressBarProps) {
    return (
        <div className={`progress-bar-container ${large ? 'large' : ''}`}>
            <div 
                className="progress-bar-fill" 
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            ></div>
        </div>
    )
}
