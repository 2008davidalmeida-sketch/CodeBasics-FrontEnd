import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { AuthLoader } from './components/AuthLoader/AuthLoader'
import './AuthCallback.css'

export default function AuthCallback() {
    const { login } = useAuth()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        const token = searchParams.get('token')

        // Simulate a tiny delay for the "wow" effect of the loader
        const timer = setTimeout(() => {
            // if token is present, login and redirect to dashboard
            if (token) {
                login(token)
                navigate('/dashboard')
            } else {
                // otherwise redirect to login
                navigate('/login')
            }
        }, 1500)

        // Cleanup the timer
        return () => clearTimeout(timer)
    }, [searchParams, login, navigate])

    // Render the auth loader
    return (
        <div className="auth-callback-container">
            <AuthLoader />
        </div>
    )
}