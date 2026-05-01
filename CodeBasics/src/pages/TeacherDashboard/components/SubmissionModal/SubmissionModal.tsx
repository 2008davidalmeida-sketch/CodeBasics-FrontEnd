import type { Submission, User, Challenge } from '../../../../types'

interface SubmissionModalProps {
    submission: Submission;
    student?: User;
    challenge?: Challenge;
    onClose: () => void;
}

export function SubmissionModal({ submission, student, challenge, onClose }: SubmissionModalProps) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Inspecionar Submissão</h2>
                    <button className="close-modal" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    <div className="submission-meta">
                        <span><strong>Aluno:</strong> {student?.name || 'Desconhecido'}</span>
                        <span><strong>Desafio:</strong> {challenge?.title || 'Desconhecido'}</span>
                        <span><strong>Estado:</strong> {submission.passed ? '✅ Passou' : '❌ Falhou'}</span>
                    </div>
                    <div className="code-viewer">
                        <pre><code>{submission.code}</code></pre>
                    </div>
                    <div className="ai-feedback-box">
                        <h3>Feedback da IA</h3>
                        <p>{submission.feedback}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
