import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleButton } from '../GoogleButton/GoogleButton';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

export function Header() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Dropdown menu state
    useEffect(() => {
        // Event listener to close the menu when clicking outside
        document.addEventListener('mousedown', (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        });

        // Close menu on route change
        return () => document.removeEventListener('mousedown', () => setIsMenuOpen(false));
    }, []);

    const handleLogout = () => {
        // Clear user session and redirect to home page
        logout();
        setIsMenuOpen(false);
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    <strong>Code</strong>.Basics
                </Link>

                <nav className="header-nav">
                    <Link to="/como-funciona" className="nav-link">como funciona</Link>
                    {user?.role === 'teacher' && (
                        <Link to="/teacher" className="nav-link teacher-link">área do professor</Link>
                    )}

                    {user ? (
                        <div className="user-menu-container" ref={menuRef}>
                            <button
                                className="user-profile-btn"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                title={user.name}
                            >
                                {user.photo ? (
                                    <img src={user.photo} alt={user.name} className="user-avatar" />
                                ) : (
                                    <div className="user-initials">
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                            </button>

                            {isMenuOpen && (
                                <div className="user-dropdown">
                                    <div className="dropdown-header">
                                        <span className="user-name">{user.name}</span>
                                        <span className="user-email">{user.email}</span>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <Link
                                        to="/dashboard"
                                        className="dropdown-item"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        🏠 Painel do Aluno
                                    </Link>

                                    {user.role === 'teacher' && (
                                        <Link
                                            to="/teacher"
                                            className="dropdown-item"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            👨‍🏫 Área do Professor
                                        </Link>
                                    )}

                                    <button onClick={handleLogout} className="dropdown-item logout">
                                        🚪 Sair da Conta
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <GoogleButton />
                    )}
                </nav>
            </div>
        </header>
    );
}
