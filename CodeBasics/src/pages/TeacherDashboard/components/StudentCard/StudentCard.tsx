import type { User } from '../../../../types'

interface StudentProgress extends User {
    completedCount: number
    totalCount: number
    lastSubmissionDate?: string
}

interface StudentCardProps {
    student: StudentProgress;
    onClick: () => void;
}

export function StudentCard({ student, onClick }: StudentCardProps) {
    const progressPercentage = (student.completedCount / student.totalCount) * 100;

    return (
        <div className="student-card" onClick={onClick}>
            <div className="student-info-main">
                <div className="student-avatar">
                    {student.photo ? (
                        <img src={student.photo} alt={student.name} />
                    ) : (
                        <span>{student.name[0]}</span>
                    )}
                </div>
                <div>
                    <h3>{student.name}</h3>
                    <p>{student.email}</p>
                </div>
            </div>
            <div className="student-progress-section">
                <div className="progress-labels">
                    <span>Progresso</span>
                    <span>{student.completedCount}/{student.totalCount}</span>
                </div>
                <div className="progress-bar-bg">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>
            <div className="student-footer">
                <span>
                    Última atividade: {student.lastSubmissionDate
                        ? new Date(student.lastSubmissionDate).toLocaleDateString()
                        : 'Nunca'}
                </span>
            </div>
        </div>
    );
}
