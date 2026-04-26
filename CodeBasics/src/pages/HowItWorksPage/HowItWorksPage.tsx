import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { HowItWorks } from './components/HowItWorks';
import { FadeIn } from '../../utils/FadeIn/FadeIn';
import './HowItWorksPage.css';

export function HowItWorksPage() {
    return (
        <div className="how-it-works-page">
            <Header />
            <main className="main-content">
                <FadeIn delay={100}>
                    <div className="page-header">
                        <h1>Como funciona a plataforma?</h1>
                        <p>Descobre todos os passos para começares a programar e a receber feedback em tempo real.</p>
                    </div>
                </FadeIn>

                <FadeIn delay={200}>
                    <HowItWorks />
                </FadeIn>
            </main>
            <Footer />
        </div>
    );
}

export default HowItWorksPage;
