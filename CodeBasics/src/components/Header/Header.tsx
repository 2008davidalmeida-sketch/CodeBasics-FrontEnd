import { Link } from 'react-router-dom';
import { GoogleButton } from '../GoogleButton/GoogleButton';
import './Header.css';

export function Header() {
    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    <strong>Code</strong>.Basics
                </Link>
                
                <nav className="header-nav">
                    <Link to="/como-funciona" className="nav-link">como funciona</Link>
                    <GoogleButton />
                </nav>
            </div>
        </header>
    );
}
