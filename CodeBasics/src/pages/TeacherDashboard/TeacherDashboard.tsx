import { useState, useEffect } from 'react'
import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'
import { getAllStudents, getAllSubmissions, getChallenges } from '../../services/api'
import type { User, Submission, Challenge } from '../../types'

// Components
import { ChallengesAnalytics } from './components/ChallengesAnalytics/ChallengesAnalytics'
import { StatsOverview } from './components/StatsOverview/StatsOverview'
import { StudentCard } from './components/StudentCard/StudentCard'
import { SubmissionsTable } from './components/SubmissionsTable/SubmissionsTable'
import { SubmissionModal } from './components/SubmissionModal/SubmissionModal'

import './TeacherDashboard.css'

interface StudentProgress extends User {
    completedCount: number
    totalCount: number
    lastSubmissionDate?: string
}

export default function TeacherDashboard() {
    const [students, setStudents] = useState<StudentProgress[]>([])
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [challenges, setChallenges] = useState<Challenge[]>([])
    const [activeTab, setActiveTab] = useState<'students' | 'submissions' | 'challenges'>('submissions')
    const [studentPage, setStudentPage] = useState(1)
    const [studentSearch, setStudentSearch] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    // Pagination items per page
    const ITEMS_PER_PAGE = 6

    // Filters
    const [filters, setFilters] = useState({
        student: 'all',
        challenge: 'all',
        status: 'all' as 'all' | 'passed' | 'failed'
    })

    // Selected submission for inspection
    const [inspectingSubmission, setInspectingSubmission] = useState<Submission | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true)
                const [studentsRes, submissionsRes, challengesRes] = await Promise.all([
                    getAllStudents(),
                    getAllSubmissions(),
                    getChallenges()
                ])

                // Get all submissions, challenges and students from the API
                const allSubmissions = submissionsRes.data
                const allChallenges = challengesRes.data
                const allStudents = studentsRes.data

                // Calculate progress for each student
                const studentsWithProgress = allStudents.map((student: User) => {
                    const studentId = student.id || (student as any)._id;
                    const studentSubmissions = allSubmissions.filter((s: Submission) => s.userId === studentId)
                    const uniquePassedChallenges = new Set(
                        studentSubmissions.filter((s: Submission) => s.passed).map((s: Submission) => s.challengeId)
                    )
                    
                    // Get the last submission for each student
                    const lastSub = studentSubmissions.length > 0 
                        ? studentSubmissions.sort((a: Submission, b: Submission) => 
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
                        : null

                    // Return student with progress
                    return {
                        ...student,
                        completedCount: uniquePassedChallenges.size,
                        totalCount: allChallenges.length,
                        lastSubmissionDate: lastSub?.createdAt
                    }
                })

                // Update the state
                setStudents(studentsWithProgress)
                setSubmissions(allSubmissions)
                setChallenges(allChallenges)
                setIsLoading(false)
            } catch (err: any) {
                console.error('Erro ao carregar dados do professor:', err)
                
                if (err.response?.status === 401 || err.response?.status === 403) {
                    setError('Acesso negado. Esta área é exclusiva para professores.')
                } else if (!err.response) {
                    setError('O servidor backend parece estar desligado ou inacessível.')
                } else {
                    setError('Ocorreu um erro ao carregar os dados. Tenta novamente mais tarde.')
                }
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    // Handle filter changes
    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value })) 
    }

    // Analytics: Find hardest challenges
    const challengeStats = challenges.map(c => {
        // Filter submissions by challenge
        const challengeSubs = submissions.filter(s => s.challengeId === c._id)
        
        // Count attempts and passes
        const attempts = challengeSubs.length
        const passes = challengeSubs.filter(s => s.passed).length
        
        // Calculate fail rate
        const failRate = attempts > 0 ? ((attempts - passes) / attempts) * 100 : 0
        
        // Return challenge with fail rate
        return { title: c.title, failRate }
    }).sort((a, b) => b.failRate - a.failRate)

    const successRate = submissions.length > 0 
        ? (submissions.filter(s => s.passed).length / submissions.length) * 100 
        : 0

    // Filtered submissions
    const filteredSubmissions = submissions.filter(s => {
        const studentMatch = filters.student === 'all' || 
                           s.userId === filters.student || 
                           (typeof s.userId === 'object' && (s.userId as any)._id === filters.student);
                           
        const challengeMatch = filters.challenge === 'all' || 
                             s.challengeId === filters.challenge || 
                             (typeof s.challengeId === 'object' && (s.challengeId as any)._id === filters.challenge);
                             
        const statusMatch = filters.status === 'all' || (filters.status === 'passed' ? s.passed : !s.passed)
        return studentMatch && challengeMatch && statusMatch
    })

    if (isLoading) {
        return (
            <div className="teacher-dashboard">
                <Header />
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>A carregar dados da turma...</p>
                    </div>
                <Footer />
            </div>
        )
    }

    if (error) {
        return (
            <div className="teacher-dashboard">
                <Header />
                <div className="error-container">
                    <p>{error}</p>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="teacher-dashboard">
            <Header />
            
            <main className="teacher-content">
                <div className="teacher-container">
                    <header className="teacher-header-section">
                        <h1>Área do Professor</h1>
                        <p className="subtitle">Gerir alunos e acompanhar o progresso com estatísticas detalhadas.</p>
                    </header>

                    <StatsOverview 
                        totalStudents={students.length}
                        hardestChallenge={challengeStats[0]?.failRate > 0 ? challengeStats[0] : undefined}
                        avgCompletion={successRate}
                    />

                    <div className="tabs-container">
                        <button 
                            className={`tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
                            onClick={() => setActiveTab('submissions')}
                        >
                            Histórico de Submissões
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'challenges' ? 'active' : ''}`}
                            onClick={() => setActiveTab('challenges')}
                        >
                            Análise por Desafio
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
                            onClick={() => setActiveTab('students')}
                        >
                            Lista de Alunos
                        </button>
                    </div>

                    {activeTab === 'challenges' ? (
                        <ChallengesAnalytics 
                            challenges={challenges}
                            submissions={submissions}
                        />
                    ) : activeTab === 'students' ? (
                        <div className="students-list">
                            <div className="list-header">
                                <h2>Progresso da Turma</h2>
                                <div className="search-input-wrapper" style={{ maxWidth: '300px', marginTop: '2rem', marginBottom: '2.5rem' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Pesquisar aluno por nome..."
                                        value={studentSearch}
                                        onChange={(e) => {
                                            setStudentSearch(e.target.value);
                                            setStudentPage(1);
                                        }}
                                        className="search-input"
                                    />
                                </div>
                            </div>
                            <div className="students-grid">
                                {students
                                    .filter(u => u.role === 'student' && u.name.toLowerCase().includes(studentSearch.toLowerCase()))
                                    .slice((studentPage - 1) * ITEMS_PER_PAGE, studentPage * ITEMS_PER_PAGE)
                                    .map(student => {
                                        const sId = student.id || (student as any)._id;
                                        return (
                                            <StudentCard 
                                                key={sId} 
                                                student={student} 
                                                onClick={() => {
                                                    handleFilterChange('student', sId)
                                                    setActiveTab('submissions')
                                                }} 
                                            />
                                        );
                                    })}
                            </div>

                            {/* Pagination Controls */}
                            {students.filter(u => u.role === 'student' && u.name.toLowerCase().includes(studentSearch.toLowerCase())).length > ITEMS_PER_PAGE && (
                                <div className="pagination-controls">
                                    <button 
                                        disabled={studentPage === 1}
                                        onClick={() => setStudentPage(p => p - 1)}
                                        className="pagination-btn"
                                    >
                                        Anterior
                                    </button>
                                    <span className="page-info">
                                        Página {studentPage} de {Math.ceil(students.filter(u => u.role === 'student' && u.name.toLowerCase().includes(studentSearch.toLowerCase())).length / ITEMS_PER_PAGE)}
                                    </span>
                                    <button 
                                        disabled={studentPage === Math.ceil(students.filter(u => u.role === 'student' && u.name.toLowerCase().includes(studentSearch.toLowerCase())).length / ITEMS_PER_PAGE)}
                                        onClick={() => setStudentPage(p => p + 1)}
                                        className="pagination-btn"
                                    >
                                        Próximo
                                    </button>
                                </div>
                            )}

                            {students.filter(u => u.role === 'student' && u.name.toLowerCase().includes(studentSearch.toLowerCase())).length === 0 && (
                                <div className="empty-state">
                                    <p>Nenhum aluno encontrado com "{studentSearch}".</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <SubmissionsTable 
                            submissions={filteredSubmissions}
                            students={students}
                            challenges={challenges}
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onInspect={setInspectingSubmission}
                        />
                    )}
                </div>
            </main>

            {inspectingSubmission && (
                <SubmissionModal 
                    submission={inspectingSubmission}
                    student={students.find(s => s.id === inspectingSubmission.userId)}
                    challenge={challenges.find(c => c._id === inspectingSubmission.challengeId)}
                    onClose={() => setInspectingSubmission(null)}
                />
            )}

            <Footer />
        </div>
    )
}
