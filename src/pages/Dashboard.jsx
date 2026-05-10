import React from 'react';
import { useAuth } from '../context/AuthContext';
import CustomerDashboard from '../components/dashboards/CustomerDashboard';
import AgentDashboard from '../components/dashboards/AgentDashboard';
import SupervisorDashboard from '../components/dashboards/SupervisorDashboard';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import { ShieldAlert } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight capitalize">
            {user.role} Dashboard
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Real-time metrics and operational insights.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-2 mt-4 md:mt-0">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-bold text-gray-700">Live SN Connection</span>
        </div>
      </div>

      {/* Render correct dashboard based on role */}
      {user.role === 'customer' && <CustomerDashboard user={user} />}
      {user.role === 'agent' && <AgentDashboard user={user} />}
      {user.role === 'supervisor' && <SupervisorDashboard user={user} />}
      {user.role === 'admin' && <AdminDashboard user={user} />}
      
      {/* Fallback for unknown roles */}
      {!['customer', 'agent', 'supervisor', 'admin'].includes(user.role) && (
        <div className="p-8 glass-panel text-center flex flex-col items-center">
            <ShieldAlert className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
            <p className="text-gray-500 mt-2">Your role '{user.role}' does not have a configured dashboard view.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
