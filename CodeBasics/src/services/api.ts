import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

// create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

// attach token to every request
api.interceptors.request.use((config) => {

    // get token from local storage
    const token = localStorage.getItem('token')

    // if token exists, attach it to the request
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// auth
export function getMe(config?: AxiosRequestConfig) {
    return api.get('/auth/me', config)
}

// challenges
export function getChallenges(config?: AxiosRequestConfig) {
    return api.get('/challenges', config)
}

export function getChallenge(id: string, config?: AxiosRequestConfig) {
    return api.get(`/challenges/${id}`, config)
}

// submissions
export function createSubmission(challengeId: string, code: string, config?: AxiosRequestConfig) {
    return api.post('/submissions', { challengeId, code }, config)
}

export function getMySubmissions(config?: AxiosRequestConfig) {
    return api.get('/submissions/me', config)
}

export function getChallengeSubmissions(challengeId: string, config?: AxiosRequestConfig) {
    return api.get(`/submissions/challenge/${challengeId}`, config)
}

// teacher endpoints
export function getAllStudents(config?: AxiosRequestConfig) {
    return api.get('/users/students', config)
}

export function getAllSubmissions(params?: any, config?: AxiosRequestConfig) {
    return api.get('/submissions', { ...config, params })
}

export default api