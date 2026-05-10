import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';

// Customer Pages
import Home from './pages/Home';
import CreateCase from './pages/CreateCase';
import TrackCase from './pages/TrackCase';

// Agent & Supervisor Pages
import AgentDashboard from './pages/AgentDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import SlaMonitoring from './pages/SlaMonitoring';
import Escalations from './pages/Escalations';

// Global Pages
import Chatbot from './pages/Chatbot';
import KnowledgeBase from './pages/KnowledgeBase';
import Notifications from './pages/Notifications';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        {/* Dynamic Root Index based on Role */}
        <Route index element={
          user?.role === 'admin' || user?.role === 'supervisor' ? <Navigate to="/supervisor-dashboard" replace /> :
          user?.role === 'agent' ? <Navigate to="/agent-dashboard" replace /> :
          <Navigate to="/home" replace />
        } />

        {/* Customer Routes */}
        <Route path="home" element={<Home />} />
        <Route path="create-case" element={<CreateCase />} />
        <Route path="track-case" element={<TrackCase />} />

        {/* Agent Routes */}
        <Route path="agent-dashboard" element={<ProtectedRoute allowedRoles={['agent', 'supervisor', 'admin']}><AgentDashboard /></ProtectedRoute>} />

        {/* Supervisor Routes */}
        <Route path="supervisor-dashboard" element={<ProtectedRoute allowedRoles={['supervisor', 'admin']}><SupervisorDashboard /></ProtectedRoute>} />
        <Route path="sla-monitoring" element={<ProtectedRoute allowedRoles={['supervisor', 'admin', 'agent']}><SlaMonitoring /></ProtectedRoute>} />
        <Route path="escalations" element={<ProtectedRoute allowedRoles={['supervisor', 'admin']}><Escalations /></ProtectedRoute>} />

        {/* Global Routes */}
        <Route path="chatbot" element={<Chatbot />} />
        <Route path="knowledge-base" element={<KnowledgeBase />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
