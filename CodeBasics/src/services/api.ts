import axios from 'axios'

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
export function getMe() {
    return api.get('/auth/me')
}

// challenges
export function getChallenges() {
    return api.get('/challenges')
}

export function getChallenge(id: string) {
    return api.get(`/challenges/${id}`)
}

// submissions
export function createSubmission(challengeId: string, code: string) {
    return api.post('/submissions', { challengeId, code })
}

export function getMySubmissions() {
    return api.get('/submissions/me')
}

export function getChallengeSubmissions(challengeId: string) {
    return api.get(`/submissions/challenge/${challengeId}`)
}

export default api