import React from 'react';
import { Bell, Clock } from 'lucide-react';

const Notifications = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-gray-500 mt-2 text-lg">Recent alerts and updates from CaseFlow AI.</p>
        </div>
        <button className="text-sm font-bold text-samsung-blue hover:bg-blue-50 px-5 py-2.5 rounded-xl transition-colors border border-transparent hover:border-blue-100 shadow-sm">
          Mark all as read
        </button>
      </div>

      <div className="glass-panel overflow-hidden border border-white">
        <div className="divide-y divide-gray-100/80">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`p-6 flex items-start space-x-5 hover:bg-white/60 transition-colors cursor-pointer ${i < 3 ? 'bg-blue-50/40' : ''}`}>
              <div className={`p-3 rounded-full flex-shrink-0 ${i < 3 ? 'bg-blue-100 text-samsung-blue shadow-inner' : 'bg-gray-100 text-gray-400'}`}>
                <Bell className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1.5">
                  <h3 className={`text-base font-bold ${i < 3 ? 'text-gray-900' : 'text-gray-600'}`}>
                    Case CS0010{i} Updated by AI Engine
                  </h3>
                  <span className="text-xs font-bold text-gray-400 flex items-center bg-white px-2 py-1 rounded-md shadow-sm border border-gray-50">
                    <Clock className="w-3.5 h-3.5 mr-1.5" /> {i}h ago
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  The status of your case has been changed to "In Progress". The Assignment Engine has routed this to the optimal agent based on workload and skills.
                </p>
              </div>
              {i < 3 && <div className="w-2.5 h-2.5 rounded-full samsung-gradient shadow-sm mt-2 flex-shrink-0"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
