import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import CreateCase from './pages/CreateCase';
import TrackCase from './pages/TrackCase';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import KnowledgeBase from './pages/KnowledgeBase';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Escalations from './pages/Escalations';
import Notifications from './pages/Notifications';
import SlaMonitoring from './pages/SlaMonitoring';
import AgentSlaTracking from './pages/AgentSlaTracking';
import AuditLogs from './pages/AuditLogs';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#F4F7F6]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1428A0]"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/portal" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />
          <Route path="create-case" element={<CreateCase />} />
          <Route path="track-case" element={<TrackCase />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="knowledge" element={<KnowledgeBase />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="sla-monitoring" element={<SlaMonitoring />} />
          <Route path="agent-sla" element={<AgentSlaTracking />} />
          <Route path="escalations" element={<Escalations />} />
          <Route path="audit-logs" element={<AuditLogs />} />
        </Route>
        
        {/* Redirect unknown routes to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
