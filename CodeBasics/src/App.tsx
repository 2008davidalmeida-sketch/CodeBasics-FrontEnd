import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './utils/ScrollToTop';
import LandingPage from './pages/LandingPage/LandingPage';
import HowItWorksPage from './pages/HowItWorksPage/HowItWorksPage';
import AuthCallback from './pages/AuthCallback/AuthCallback';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/como-funciona" element={<HowItWorksPage />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
