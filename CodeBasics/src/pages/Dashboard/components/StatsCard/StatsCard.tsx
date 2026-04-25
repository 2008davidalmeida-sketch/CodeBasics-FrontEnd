import './StatsCard.css'

interface StatsCardProps {
    label: string
    value: string | number
    icon?: string
    accent?: boolean
}

export function StatsCard({ label, value, icon, accent }: StatsCardProps) {
    return (
        <div className="stats-card">
            <span className="stats-label">{label}</span>
            <span className={`stats-value ${accent ? 'text-accent' : ''}`}>
                {value} {icon}
            </span>
        </div>
    )
}
