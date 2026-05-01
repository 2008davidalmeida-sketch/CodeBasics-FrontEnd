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
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import './App.css';

// Helper component to redirect users based on their role
function RoleBasedDashboard() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (!user) return <Navigate to="/" replace />;

    return user.role === 'teacher' ? <TeacherDashboard /> : <Dashboard />;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/como-funciona" element={<HowItWorksPage />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/dashboard" element={<RoleBasedDashboard />} />
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
