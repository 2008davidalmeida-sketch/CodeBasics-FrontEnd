import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './AuthCallback.css'

export default function AuthCallback() {
    const { login } = useAuth()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        // get token from url
        const token = searchParams.get('token')

        // Simulate a tiny delay for the "wow" effect of the loader
        const timer = setTimeout(() => {
            if (token) {
                login(token)
                navigate('/challenges')
            } else {
                navigate('/login')
            }
        }, 3000)

        return () => clearTimeout(timer)
    }, [searchParams, login, navigate])

    return (
        <div className="auth-callback-container">
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
        </div>
    )
}