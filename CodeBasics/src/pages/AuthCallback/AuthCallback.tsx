import { useEffect } from 'react'
import { useNavigate} from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { AuthLoader } from './components/AuthLoader/AuthLoader'
import './AuthCallback.css'

export default function AuthCallback() {
    const { login, user, loading: authLoading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        // We've been redirected back. The cookie should be set.
        // Tell AuthContext to fetch the user.
        login()
    }, [])

    useEffect(() => {
        // after user load, redirect based on authentication status and role
        if (authLoading) return

        console.log('AuthCallback: user loaded', user)
        if (!user) {
            navigate('/nao-autorizado', { replace: true })
        } else if (user.role === 'teacher') {
            navigate('/teacher', { replace: true })
        } else {
            navigate('/dashboard', { replace: true })
        }
    }, [user, authLoading, navigate])

    // Render the auth loader
    return (
        <div className="auth-callback-container">
            <AuthLoader />
        </div>
    )
}