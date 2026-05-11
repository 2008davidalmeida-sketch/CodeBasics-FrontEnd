import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

interface AccessDeniedCardProps {
    title: string;
    message: string;
}

export function AccessDeniedCard({ title, message }: AccessDeniedCardProps) {
    const { logout } = useAuth()

    const handleSwitchAccount = () => {
        // logout and redirect to google auth
        logout()
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
    }

    return (
        <div className="auth-card">
            <div className="icon-wrapper">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            </div>
            <h1>{title}</h1>
            <p>{message}</p>
            
            <button onClick={handleSwitchAccount} className="btn-home" style={{ width: '100%', marginBottom: '0.5rem' }}>
                Tentar com outra conta
            </button>
            
            <Link to="/" className="btn-back">
                Voltar à Página Inicial
            </Link>
        </div>
    )
}
