import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FilePlus, Search, MessageSquare, Book, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const actions = [
    { title: 'Create Case', desc: 'Report an issue or request service', icon: FilePlus, path: '/create-case', color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Track Status', desc: 'Check updates on existing cases', icon: Search, path: '/track-case', color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'AI Assistant', desc: 'Get instant automated help', icon: MessageSquare, path: '/chatbot', color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Knowledge Base', desc: 'Search solution articles', icon: Book, path: '/knowledge', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  return (
    <div className="space-y-8">
      <div className="glass-panel p-10 overflow-hidden relative border-none bg-gradient-to-br from-[#1428A0] to-[#0A1450] text-white">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">Welcome to CaseFlow AI</h1>
          <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">
            Hello, <span className="font-bold text-white">{user?.name}</span>. 
            Experience intelligent service management powered by ServiceNow Zurich. 
            Create, track, and resolve cases faster with our automated engine.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <div 
                key={idx} 
                onClick={() => navigate(action.path)}
                className="glass-card cursor-pointer group"
              >
                <div className={`w-14 h-14 rounded-2xl ${action.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                  <Icon className={`h-7 w-7 ${action.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-500 font-medium mb-6">{action.desc}</p>
                <div className="flex items-center text-samsung-blue text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                  <span>Open</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">System Updates</h2>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <p className="text-gray-600 font-medium">No major system updates. The Categorization and Assignment engines are running optimally.</p>
            </div>
        </div>
        <div className="glass-panel p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Profile</h2>
            <div className="space-y-4">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Role</p>
                    <p className="font-semibold text-gray-900 capitalize">{user?.role}</p>
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">System ID</p>
                    <p className="font-mono text-sm text-gray-600 bg-gray-50 p-2 rounded-lg mt-1 break-all">{user?.sys_id}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
