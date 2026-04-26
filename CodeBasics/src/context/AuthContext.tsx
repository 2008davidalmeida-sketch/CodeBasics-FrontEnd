import { createContext, useContext, useState, useEffect } from 'react'
import type { User } from '../types'
import { getMe } from '../services/api'

interface AuthContextType {
    user: User | null
    token: string | null
    login: (token: string) => void
    logout: () => void
    loading: boolean
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | null>(null)

// AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
    const [loading, setLoading] = useState(true)

    // Effect to check if the user is authenticated
    useEffect(() => {
        if (token) {
            // fetch user data from token
            getMe()
                .then(res => setUser(res.data)) // set user data
                .catch(() => logout()) // if there is an error, logout
                .finally(() => setLoading(false)) // finally set loading to false
        } else {
            setLoading(false)
        }
    }, [token])

    // Login function
    function login(newToken: string) {
        // save token and fetch user
        localStorage.setItem('token', newToken)
        setToken(newToken)
    }

    // Logout function
    function logout() {
        // clear token and user
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    // check if the context is not null
    const context = useContext(AuthContext)
    // if the context is null, throw an error
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    // return the context
    return context
}