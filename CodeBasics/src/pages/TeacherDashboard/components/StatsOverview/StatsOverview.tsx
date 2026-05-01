interface StatsOverviewProps {
    totalStudents: number;
    hardestChallenge?: { title: string; failRate: number };
    avgCompletion: number;
}

export function StatsOverview({ totalStudents, hardestChallenge, avgCompletion }: StatsOverviewProps) {
    return (
        <div className="stats-grid">
            <div className="stat-card">
                <span className="stat-icon">👥</span>
                <div className="stat-info">
                    <h3>{totalStudents}</h3>
                    <p>Usuários Registados</p>
                </div>
            </div>
            <div className="stat-card warning">
                <span className="stat-icon">⚠️</span>
                <div className="stat-info">
                    <h3>{hardestChallenge?.title || 'N/A'}</h3>
                    <p>Maior Dificuldade ({Math.round(hardestChallenge?.failRate || 0)}% falhas)</p>
                </div>
            </div>
            <div className="stat-card success">
                <span className="stat-icon">📈</span>
                <div className="stat-info">
                    <h3>{Math.round(avgCompletion)}%</h3>
                    <p>Taxa de Sucesso</p>
                </div>
            </div>
        </div>
    );
}
