import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { AuthLoader } from './components/AuthLoader/AuthLoader'
import './AuthCallback.css'

export default function AuthCallback() {
    const { login, user, loading: authLoading } = useAuth()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        // get token from url
        const token = searchParams.get('token')
        if (token) {
            login(token)
        } else if (!authLoading && !token) {
            navigate('/nao-autorizado')
        }
    }, [searchParams, login, navigate, authLoading])

    useEffect(() => {
        // after user load, redirect to dashboard based on role
        if (!authLoading && user) {
            if (user.role === 'teacher') {
                navigate('/teacher', { replace: true })
            } else {
                navigate('/dashboard', { replace: true })
            }
        }
    }, [user, authLoading, navigate])

    // Render the auth loader
    return (
        <div className="auth-callback-container">
            <AuthLoader />
        </div>
    )
}