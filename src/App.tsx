import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import History from './components/History';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Insights from './components/Insights';
import Reports from './components/Reports';
import Docs from './pages/Docs';
import Support from './pages/Support';
import About from './pages/About';
import Privacy from './pages/Privacy';
import AuthPage from './components/AuthPage';
import FeedbackDashboard from './components/FeedbackDashboard';
import PricingHome from './pages/Pricing';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import TermsPage from './pages/Terms';
import NotificationPage from './components/NotificationPage';
import { AuthProvider } from './context/AuthContext';
import Documentation from './pages/Documentation'
import CommunityForum from './pages/CommunityForum'
import VideoStreamer from './components/EmotionMonitor';
import PrivateRoute from './components/ProtectedRoute';
import FullPageEmotionAIChatbot from '../src/components/AiAssistant.jsx' 

const Layout = () => (
  <div className="flex bg-black min-h-screen text-white">
    <Sidebar />
    <div className="flex-grow p-6 bg-black">
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/monitor" element={<VideoStreamer />} />
        <Route path="/history" element={<History />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/feedback-dashboard" element={<FeedbackDashboard />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/assistant" element={<FullPageEmotionAIChatbot />} />
      </Routes>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <div className="bg-black text-white min-h-screen">
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/authPage" element={<AuthPage />} />
            <Route path="/register" element={<Navigate to="/authPage" />} />
            <Route path="/login" element={<Navigate to="/authPage" />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/second-docs" element={<Documentation />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/support" element={<Support />} />
            <Route path="/pricing" element={<PricingHome />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/forum" element={<CommunityForum />} />

            <Route path="/*" element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;