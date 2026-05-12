import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, FilePlus, Search, MessageSquare, Book, Bell, 
  LogOut, Hexagon, LayoutDashboard, TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    const items = [
      { name: 'Home', path: '/portal', icon: Home },
    ];
    
    if (user?.role === 'admin' || user?.role === 'supervisor' || user?.role === 'agent') {
      items.push({ name: 'Dashboard', path: '/portal/dashboard', icon: LayoutDashboard });
    }
    
    if (user?.role === 'admin' || user?.role === 'supervisor') {
      items.push({ name: 'Audit Logs', path: '/portal/audit-logs', icon: Search });
    }
    
    if (user?.role === 'admin') {
      items.push({ name: 'Agent SLA', path: '/portal/agent-sla', icon: TrendingUp });
    }
    
    items.push(
      { name: 'Create Case', path: '/portal/create-case', icon: FilePlus },
      { name: 'Track Case', path: '/portal/track-case', icon: Search },
      { name: 'AI Chatbot', path: '/portal/chatbot', icon: MessageSquare },
      { name: 'Knowledge Base', path: '/portal/knowledge', icon: Book },
      { name: 'Notifications', path: '/portal/notifications', icon: Bell }
    );
    
    return items;
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-outfit selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className="w-72 bg-[#020617] m-4 rounded-[2rem] flex flex-col justify-between z-20 shadow-2xl shadow-blue-900/10 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 blur-3xl pointer-events-none"></div>
        <div className="overflow-y-auto overflow-x-hidden">
          <div className="p-10 flex flex-col items-center border-b border-white/5">
            <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl mb-4 group transition-all">
              <Hexagon className="h-9 w-9 text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">CaseFlow</span>
            <div className="mt-4 px-4 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
              <span className="text-[8px] font-black text-blue-400 uppercase tracking-[0.2em]">
                {user?.role} Identity
              </span>
            </div>
          </div>
          <nav className="p-5 space-y-2">
            {getNavItems().map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm tracking-tight ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.2)]' 
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="h-5 w-5 opacity-90" />
                  <span className="font-semibold tracking-wide">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className="p-6 border-t border-white/5 bg-white/5 backdrop-blur-md">
          <div className="px-5 py-4 mb-4 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-xs font-black text-white truncate">{user?.name}</p>
            <p className="text-[10px] font-bold text-white/30 truncate mt-1">{user?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 hover:shadow-sm hover:text-red-700 transition-all font-semibold"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[500px] h-[500px] bg-blue-600 rounded-full opacity-[0.03] blur-3xl pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-1/2 -ml-60 -mb-60 w-[600px] h-[600px] bg-indigo-500 rounded-full opacity-[0.02] blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto h-full relative z-10 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
