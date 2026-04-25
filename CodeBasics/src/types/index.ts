export interface User {
    id: string
    role: 'student' | 'teacher'
}

export interface Challenge {
    _id: string
    title: string
    description: string
    topic: string
    order: number
    starterCode?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface Submission {
    _id: string
    userId: string
    challengeId: string
    code: string
    feedback: string
    passed: boolean
    createdAt: string
    updatedAt: string
}