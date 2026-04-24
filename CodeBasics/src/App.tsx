import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './utils/ScrollToTop';
import LandingPage from './pages/LandingPage/LandingPage';
import HowItWorksPage from './pages/HowItWorksPage/HowItWorksPage';
import './App.css';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/como-funciona" element={<HowItWorksPage />} />
            </Routes>
        </Router>
    );
}

export default App;
