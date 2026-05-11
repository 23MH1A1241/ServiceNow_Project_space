import React, { useState, useEffect } from 'react';
import { Bell, Clock, CheckCircle2 } from 'lucide-react';
import { fetchNotifications } from '../api/serviceNow';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in font-outfit">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="inline-flex items-center px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md text-[8px] font-black text-blue-400 uppercase tracking-widest">
            Inbox
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900">Notifications</h1>
        </div>
        <button className="flex items-center space-x-2 text-[10px] font-black text-gray-400 hover:text-blue-500 uppercase tracking-widest transition-colors">
          <CheckCircle2 className="w-4 h-4" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
           <div className="py-20 text-center glass-panel border-dashed">
              <Bell className="h-10 w-10 text-gray-200 mx-auto mb-4" />
              <p className="text-lg font-black text-gray-400 tracking-tight">Nothing new here</p>
           </div>
        ) : notifications.map((n, i) => (
          <div key={i} className="glass-panel p-6 flex items-center space-x-6 group hover:border-blue-500/20 transition-all cursor-pointer relative overflow-hidden">
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${i < 3 ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                <Bell className="w-5 h-5" />
             </div>
             <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                   <h3 className="text-sm font-black text-gray-900">{n.element || 'System Alert'}</h3>
                   <span className="text-[10px] font-bold text-gray-300">•</span>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {new Date(n.sys_created_on).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                   </span>
                </div>
                <p className="text-[12px] text-gray-400 font-medium line-clamp-1 group-hover:text-gray-600 transition-colors">
                   {n.value || 'Recent system event processed.'}
                </p>
             </div>
             {i < 3 && (
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
