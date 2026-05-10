import React from 'react';
import { Bell, Clock, CheckCircle2 } from 'lucide-react';

const Notifications = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-2">Recent alerts and updates from the system.</p>
        </div>
        <button className="text-sm font-semibold text-[#1428A0] hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="divide-y divide-gray-100">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`p-6 flex items-start space-x-4 hover:bg-gray-50 transition-colors ${i < 3 ? 'bg-blue-50/30' : ''}`}>
              <div className={`p-2 rounded-full ${i < 3 ? 'bg-blue-100 text-[#1428A0]' : 'bg-gray-100 text-gray-500'}`}>
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-sm font-bold ${i < 3 ? 'text-gray-900' : 'text-gray-600'}`}>
                    Case CS0010{i} Updated
                  </h3>
                  <span className="text-xs font-semibold text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {i}h ago
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  The status of your case has been changed to "In Progress". A technician will be assigned shortly.
                </p>
              </div>
              {i < 3 && <div className="w-2 h-2 rounded-full bg-[#1428A0] mt-2"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
