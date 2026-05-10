import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, FilePlus, Search, MessageSquare, Book, Bell, 
  LogOut, Hexagon, LayoutDashboard, AlertTriangle, Activity 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine which navigation items to show based on role
  const getNavItems = () => {
    const items = [];
    
    if (user?.role === 'customer') {
      items.push({ name: 'Home', path: '/home', icon: Home });
    }
    
    if (user?.role === 'agent' || user?.role === 'supervisor' || user?.role === 'admin') {
      items.push({ name: 'Work Dashboard', path: '/agent-dashboard', icon: LayoutDashboard });
      items.push({ name: 'SLA Monitoring', path: '/sla-monitoring', icon: Activity });
    }
    
    if (user?.role === 'supervisor' || user?.role === 'admin') {
      items.push({ name: 'Supervisor View', path: '/supervisor-dashboard', icon: LayoutDashboard });
      items.push({ name: 'Escalations', path: '/escalations', icon: AlertTriangle });
    }

    // Global items
    items.push({ name: 'Create Case', path: '/create-case', icon: FilePlus });
    items.push({ name: 'Track Case', path: '/track-case', icon: Search });
    items.push({ name: 'AI Chatbot', path: '/chatbot', icon: MessageSquare });
    items.push({ name: 'Knowledge Base', path: '/knowledge-base', icon: Book });
    items.push({ name: 'Notifications', path: '/notifications', icon: Bell });
    
    return items;
  };

  return (
    <div className="flex h-screen bg-[#F4F7F6] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 glass-panel m-4 flex flex-col justify-between shadow-lg">
        <div className="overflow-y-auto">
          <div className="p-6 flex flex-col items-center border-b border-gray-100">
            <div className="samsung-gradient w-12 h-12 rounded-xl flex items-center justify-center shadow-md mb-3">
              <Hexagon className="h-7 w-7 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">CaseFlow AI</span>
            <span className="text-xs font-semibold text-[#1428A0] uppercase tracking-wider mt-1 bg-blue-50 px-2 py-1 rounded-md">
              {user?.role} Portal
            </span>
          </div>
          <nav className="p-4 space-y-1">
            {getNavItems().map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'samsung-gradient text-white shadow-md font-medium' 
                        : 'text-gray-600 hover:bg-white hover:shadow-sm hover:text-[#1428A0] font-medium'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-100">
          <div className="px-4 py-3 mb-2">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || user?.user_name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || 'Logged in'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-xl text-red-600 hover:bg-red-50 hover:shadow-sm transition-all font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Background decorative blob */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-[#1428A0] rounded-full opacity-5 blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto h-full relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
