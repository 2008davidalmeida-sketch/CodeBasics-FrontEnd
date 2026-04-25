import { Link } from 'react-router-dom';
import { GoogleButton } from '../../../../components/GoogleButton/GoogleButton';
import { useAuth } from '../../../../context/AuthContext';
import './ReadyToStart.css';

export function ReadyToStart() {
    const { user } = useAuth();

    return (
        <section className="ready-to-start">
            <div className="ready-to-start-container">
                <div className="cta-content">
                    <h2 className="cta-title">
                        Pronto para <span className="text-accent">começar?</span>
                    </h2>
                    <p className="cta-subtext">apenas emails institucionais das escolas de</p>
                    <p className="cta-subtext">Mangualde são aceites</p>
                </div>                             
                <div className="cta-button-container">
                    {user ? (
                        <Link to="/dashboard" className="dashboard-link-btn large">
                            Voltar ao Dashboard 🏠
                        </Link>
                    ) : (
                        <GoogleButton className="ready-google-btn" />
                    )}
                </div>
            </div>
        </section>
    );
}
