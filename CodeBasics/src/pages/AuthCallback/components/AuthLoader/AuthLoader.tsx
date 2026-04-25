import './AuthLoader.css'

export function AuthLoader() {
    return (
        <div className="auth-card">
            <div className="auth-brand">CODE.BASICS</div>
            
            <div className="loader-spinner"></div>
            
            <h2 className="auth-title">A preparar o teu ambiente</h2>
            <p className="auth-text">
                Estamos a validar a tua conta e a carregar os teus desafios. 
                Falta muito pouco!
            </p>
            
            <div className="auth-status">
                <span className="auth-status-dot"></span>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Autenticação em curso...</span>
            </div>
        </div>
    )
}
