import { Header } from '../../components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { CodeMockup } from './components/CodeMockup/CodeMockup';
import { HowItWorks } from '../HowItWorksPage/components/HowItWorks';
import { Topics } from './components/Topics/Topics';
import { ReadyToStart } from './components/ReadyToStart/ReadyToStart';
import { Footer } from '../../components/Footer/Footer';
import { FadeIn } from '../../utils/FadeIn/FadeIn';
import './LandingPage.css';

function LandingPage() {
    return (
        <div className="landing-page">
            <Header />
            <main className="main-content">
                <FadeIn delay={100}>
                    <Hero />
                </FadeIn>

                <FadeIn delay={200}>
                    <CodeMockup />
                </FadeIn>

                <FadeIn delay={100}>
                    <HowItWorks />
                </FadeIn>

                <FadeIn delay={100}>
                    <Topics />
                </FadeIn>

                <FadeIn delay={100}>
                    <ReadyToStart />
                </FadeIn>
            </main>
            <Footer />
        </div>
    );
}

export default LandingPage;
