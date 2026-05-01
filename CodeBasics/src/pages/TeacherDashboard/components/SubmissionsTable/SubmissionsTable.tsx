import { useState, useEffect, useRef } from 'react'
import type { Submission, User, Challenge } from '../../../../types'

interface SubmissionsTableProps {
    submissions: Submission[];
    students: User[];
    challenges: Challenge[];
    onInspect: (submission: Submission) => void;
    filters: {
        student: string;
        challenge: string;
        status: 'all' | 'passed' | 'failed';
    };
    onFilterChange: (key: string, value: string) => void;
}

export function SubmissionsTable({ 
    submissions, 
    students, 
    challenges, 
    onInspect, 
    filters,
    onFilterChange 
}: SubmissionsTableProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [challengeSearch, setChallengeSearch] = useState('')
    const [isChallengeOpen, setIsChallengeOpen] = useState(false)
    const [isStatusOpen, setIsStatusOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 10

    const searchRef = useRef<HTMLDivElement>(null)
    const challengeRef = useRef<HTMLDivElement>(null)
    const statusRef = useRef<HTMLDivElement>(null)

    // Sync search terms when filters change externally
    useEffect(() => {
        if (filters.student !== 'all') {
            const selected = students.find(s => (s.id === filters.student) || ((s as any)._id === filters.student))
            if (selected) setSearchTerm(selected.name)
        } else {
            setSearchTerm('')
        }
        setCurrentPage(1) // Reset page on filter change
    }, [filters.student, students])

    useEffect(() => {
        if (filters.challenge !== 'all') {
            const selected = challenges.find(c => c._id === filters.challenge)
            if (selected) setChallengeSearch(selected.title)
        } else {
            setChallengeSearch('')
        }
        setCurrentPage(1) // Reset page on filter change
    }, [filters.challenge, challenges])

    // Reset page when status filter changes
    useEffect(() => {
        setCurrentPage(1)
    }, [filters.status])

    // Close results when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            if (searchRef.current && !searchRef.current.contains(target)) setIsSearchOpen(false)
            if (challengeRef.current && !challengeRef.current.contains(target)) setIsChallengeOpen(false)
            if (statusRef.current && !statusRef.current.contains(target)) setIsStatusOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])
    return (
        <div className="submissions-section">
            <div className="filters-bar">
                <div className="filter-group student-search-group" ref={searchRef}>
                    <label>Pesquisar Aluno</label>
                    <div className="search-input-wrapper">
                        <input 
                            type="text" 
                            placeholder="Procurar por nome..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setIsSearchOpen(true);
                            }}
                            onFocus={() => setIsSearchOpen(true)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button className="clear-search" onClick={() => {
                                setSearchTerm('');
                                onFilterChange('student', 'all');
                            }}>✕</button>
                        )}
                        
                        {isSearchOpen && (searchTerm || filters.student !== 'all') && (
                            <div className="search-results">
                                <div 
                                    className={`search-item ${filters.student === 'all' ? 'active' : ''}`}
                                    onClick={() => {
                                        onFilterChange('student', 'all');
                                        setSearchTerm('');
                                        setIsSearchOpen(false);
                                    }}
                                >
                                    Todos os Usuários
                                </div>
                                {students
                                    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map(s => {
                                        const sId = s.id || (s as any)._id;
                                        return (
                                            <div 
                                                key={sId}
                                                className={`search-item ${filters.student === sId ? 'active' : ''}`}
                                                onClick={() => {
                                                    onFilterChange('student', sId);
                                                    setSearchTerm(s.name);
                                                    setIsSearchOpen(false);
                                                }}
                                            >
                                                {s.name}
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                </div>
                <div className="filter-group" ref={challengeRef}>
                    <label>Desafio</label>
                    <div className="search-input-wrapper">
                        <input 
                            type="text" 
                            placeholder="Procurar desafio..."
                            value={challengeSearch}
                            onChange={(e) => {
                                setChallengeSearch(e.target.value);
                                setIsChallengeOpen(true);
                            }}
                            onFocus={() => setIsChallengeOpen(true)}
                            className="search-input"
                        />
                        {challengeSearch && (
                            <button className="clear-search" onClick={() => {
                                setChallengeSearch('');
                                onFilterChange('challenge', 'all');
                            }}>✕</button>
                        )}
                        
                        {isChallengeOpen && (
                            <div className="search-results">
                                <div 
                                    className={`search-item ${filters.challenge === 'all' ? 'active' : ''}`}
                                    onClick={() => {
                                        onFilterChange('challenge', 'all');
                                        setChallengeSearch('');
                                        setIsChallengeOpen(false);
                                    }}
                                >
                                    Todos os Desafios
                                </div>
                                {challenges
                                    .filter(c => c.title.toLowerCase().includes(challengeSearch.toLowerCase()))
                                    .map(c => (
                                        <div 
                                            key={c._id}
                                            className={`search-item ${filters.challenge === c._id ? 'active' : ''}`}
                                            onClick={() => {
                                                onFilterChange('challenge', c._id);
                                                setChallengeSearch(c.title);
                                                setIsChallengeOpen(false);
                                            }}
                                        >
                                            {c.title}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="filter-group" ref={statusRef}>
                    <label>Estado</label>
                    <div className="search-input-wrapper">
                        <div 
                            className="search-input custom-select-trigger"
                            onClick={() => setIsStatusOpen(!isStatusOpen)}
                            style={{ cursor: 'pointer' }}
                        >
                            {filters.status === 'all' ? 'Todos os Estados' : 
                             filters.status === 'passed' ? 'Passou' : 'Falhou'}
                        </div>
                        
                        {isStatusOpen && (
                            <div className="search-results">
                                <div 
                                    className={`search-item ${filters.status === 'all' ? 'active' : ''}`}
                                    onClick={() => {
                                        onFilterChange('status', 'all');
                                        setIsStatusOpen(false);
                                    }}
                                >
                                    Todos os Estados
                                </div>
                                <div 
                                    className={`search-item ${filters.status === 'passed' ? 'active' : ''}`}
                                    onClick={() => {
                                        onFilterChange('status', 'passed');
                                        setIsStatusOpen(false);
                                    }}
                                >
                                    Passou
                                </div>
                                <div 
                                    className={`search-item ${filters.status === 'failed' ? 'active' : ''}`}
                                    onClick={() => {
                                        onFilterChange('status', 'failed');
                                        setIsStatusOpen(false);
                                    }}
                                >
                                    Falhou
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="submissions-table-container" style={{ marginTop: '3.5rem' }}>
                <table className="submissions-table">
                    <thead>
                        <tr>
                            <th>Aluno</th>
                            <th>Desafio</th>
                            <th>Data</th>
                            <th>Estado</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions
                            .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                            .map(sub => {
                                const subUserId = typeof sub.userId === 'object' ? (sub.userId as any)._id : sub.userId;
                                const subChallengeId = typeof sub.challengeId === 'object' ? (sub.challengeId as any)._id : sub.challengeId;

                                const student = students.find(s => (s.id === subUserId) || ((s as any)._id === subUserId))
                                const challenge = challenges.find(c => (c._id === subChallengeId) || ((c as any).id === subChallengeId))
                                return (
                                    <tr key={sub._id}>
                                        <td>{student?.name || 'Desconhecido'}</td>
                                        <td>{challenge?.title || 'Eliminado'}</td>
                                        <td>{new Date(sub.createdAt).toLocaleString()}</td>
                                        <td>
                                            <span className={`status-tag ${sub.passed ? 'passed' : 'failed'}`}>
                                                {sub.passed ? 'Passou' : 'Falhou'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="inspect-btn" onClick={() => onInspect(sub)}>
                                                Inspecionar
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        {submissions.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                    Nenhuma submissão encontrada com estes filtros.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {submissions.length > ITEMS_PER_PAGE && (
                <div className="pagination-controls">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="pagination-btn"
                    >
                        Anterior
                    </button>
                    <span className="page-info">
                        Página {currentPage} de {Math.ceil(submissions.length / ITEMS_PER_PAGE)}
                    </span>
                    <button 
                        disabled={currentPage === Math.ceil(submissions.length / ITEMS_PER_PAGE)}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="pagination-btn"
                    >
                        Próximo
                    </button>
                </div>
            )}
        </div>
    );
}
