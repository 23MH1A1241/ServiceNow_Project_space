import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus, Search, MessageSquare, Book } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const actions = [
    { title: 'Create Case', desc: 'Submit a new support request', icon: FilePlus, path: '/create-case', color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Track Case', desc: 'Check status of existing cases', icon: Search, path: '/track-case', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'AI Assistant', desc: 'Get instant automated help', icon: MessageSquare, path: '/chatbot', color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Knowledge Base', desc: 'Find answers and guides', icon: Book, path: '/knowledge-base', color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass-panel p-10 relative overflow-hidden samsung-gradient">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-white mb-4">Welcome back, {user?.name || user?.user_name}</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            How can CaseFlow AI assist you today? Select an option below to get started or chat with our AI assistant for immediate resolution.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none">
           <MessageSquare className="w-64 h-64 -mr-10 -mb-10 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              onClick={() => navigate(action.path)}
              className="glass-card flex flex-col items-start text-left group"
            >
              <div className={`p-4 rounded-2xl ${action.bg} ${action.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-500 text-sm">{action.desc}</p>
            </button>
          )
        })}
      </div>
    </div>
  );
};

export default Home;
