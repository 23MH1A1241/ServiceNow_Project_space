import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, FilePlus, Search, MessageSquare, Book, Bell, 
  LogOut, Hexagon, LayoutDashboard
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
    <div className="flex h-screen bg-samsung-light overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 glass-panel m-4 flex flex-col justify-between z-20">
        <div className="overflow-y-auto overflow-x-hidden">
          <div className="p-8 flex flex-col items-center border-b border-gray-100/50">
            <div className="samsung-gradient w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20 mb-4 animate-slide-up">
              <Hexagon className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">CaseFlow AI</span>
            <span className="text-xs font-bold text-samsung-blue uppercase tracking-widest mt-2 bg-blue-50 px-3 py-1 rounded-full shadow-sm">
              {user?.role} Portal
            </span>
          </div>
          <nav className="p-5 space-y-2">
            {getNavItems().map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`
                  }
                >
                  <Icon className="h-5 w-5 opacity-90" />
                  <span className="font-semibold tracking-wide">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className="p-5 border-t border-gray-100/50 bg-white/30 rounded-b-2xl">
          <div className="px-4 py-3 mb-3 bg-white/50 rounded-xl shadow-sm border border-white">
            <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs font-medium text-gray-500 truncate mt-0.5">{user?.email}</p>
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
