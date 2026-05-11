import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FilePlus, Search, MessageSquare, Book, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const actions = [
    { title: 'Create Case', icon: FilePlus, path: '/portal/create-case', color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Track Status', icon: Search, path: '/portal/track-case', color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'AI Assistant', icon: MessageSquare, path: '/portal/chatbot', color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Knowledge Base', icon: Book, path: '/portal/knowledge', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  return (
    <div className="space-y-8">
      <div className="glass-panel p-12 overflow-hidden relative border-white/5 bg-[#020617] text-white shadow-[0_20px_50px_rgba(37,99,235,0.15)]">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[9px] font-black tracking-[0.2em] uppercase">
            Enterprise Portal Active
          </div>
          <h1 className="text-5xl font-black tracking-tighter">Welcome back, <span className="text-blue-400">{user?.name.split(' ')[0]}</span>.</h1>
          <p className="text-white/40 text-lg max-w-2xl font-medium leading-relaxed">
            Your ServiceNow instance in <span className="text-white font-bold">Zurich</span> is running at peak performance. 
            AI-routing and SLA monitoring are active for all your cases.
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
                <h3 className="text-lg font-bold text-gray-900">{action.title}</h3>
                <div className="flex items-center text-samsung-blue text-xs font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300 mt-4">
                  <span>ENTER</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
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
