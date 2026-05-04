// TypeScript types for the application

export interface User {
    id: string
    name: string
    email: string
    photo?: string
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
    feedback?: string
    passed?: boolean
    status: 'pending' | 'processing' | 'completed' | 'failed'
    createdAt: string
    updatedAt: string
}