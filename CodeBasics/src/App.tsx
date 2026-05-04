import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './utils/ScrollToTop';
import LandingPage from './pages/LandingPage/LandingPage';
import HowItWorksPage from './pages/HowItWorksPage/HowItWorksPage';
import AuthCallback from './pages/AuthCallback/AuthCallback';
import Dashboard from './pages/Dashboard/Dashboard';
import TopicDetails from './pages/TopicDetails/TopicDetails';
import ExercisePage from './pages/ExercisePage/ExercisePage';
import NotAutorizedPage from './pages/NotAutorizedPage/NotAutorizedPage';
import TeacherDashboard from './pages/TeacherDashboard/TeacherDashboard';
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
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/topico/:id" element={<TopicDetails />} />
                    <Route path="/topico/:topicId/exercicio/:exerciseId" element={<ExercisePage />} />
                    <Route path="/teacher" element={<TeacherDashboard />} />
                    <Route path="/nao-autorizado" element={<NotAutorizedPage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
