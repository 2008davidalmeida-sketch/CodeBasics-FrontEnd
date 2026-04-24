import { GoogleButton } from '../../../../components/GoogleButton/GoogleButton';
import './Hero.css';

export function Hero() {
    return (
        <section className="hero">
            <div className="hero-container">
                <div className="hero-badge">
                    <span className="badge-dot"></span>
                    plataforma escolar · python
                </div>
                
                <h1 className="hero-title">
                    Aprende a programar.<br />
                    Recebe <span className="text-accent">feedback real</span><br />
                    sobre o teu código.
                </h1>
                
                <p className="hero-description">
                    Desafios práticos de Python organizados pelo programa da disciplina de API. Submete o teu código e percebe exatamente o que podes melhorar.
                </p>
                
                <div className="hero-cta">
                    <GoogleButton className="hero-google-btn" />
                    <span className="cta-subtext">apenas emails institucionais</span>
                </div>
            </div>
        </section>
    );
}
