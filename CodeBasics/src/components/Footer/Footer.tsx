import './Footer.css';

export function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-logo">
                        <strong>Code</strong>.Basics
                    </div>
                    <div className="footer-links">
                        <a href="#" className="footer-link">Sobre</a>
                        <a href="#" className="footer-link">Termos</a>
                        <a href="#" className="footer-link">Privacidade</a>
                        <a href="#" className="footer-link">Contacto</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p className="copyright">&copy; {new Date().getFullYear()} Code.Basics</p>
                    <p className='copyright'>Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
