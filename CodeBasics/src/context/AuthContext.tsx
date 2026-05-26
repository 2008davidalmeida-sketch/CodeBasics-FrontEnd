import { createContext, useContext, useState, useEffect } from 'react'
import type { User } from '../types'
import { getMe, logoutAPI } from '../services/api'

interface AuthContextType {
    user: User | null
    login: () => void // No longer takes a token string
    logout: () => void
    loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // Check if the user has a valid session cookie on load
    useEffect(() => {
        setLoading(true)
        getMe()
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    // Called after returning from Google
    function login() {
        setLoading(true)
        getMe()
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }

    // Logout function
    function logout() {
        logoutAPI().finally(() => {
            localStorage.removeItem('authToken')
            setUser(null)
        })
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
