import React from 'react';
import { Activity, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const data = [
  { name: 'Met', value: 85, color: '#10B981' },
  { name: 'Warning', value: 10, color: '#F59E0B' },
  { name: 'Breached', value: 5, color: '#EF4444' }
];

const SlaMonitoring = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">SLA Monitoring</h1>
        <p className="text-gray-500 mt-2">Real-time Service Level Agreement analytics across all assignment groups.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 flex flex-col justify-center items-center">
           <h2 className="text-lg font-bold text-gray-900 w-full text-left mb-4 flex items-center space-x-2">
             <Activity className="h-5 w-5 text-[#1428A0]" />
             <span>Overall SLA Status</span>
           </h2>
           <div className="w-full h-80">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={data}
                   cx="50%"
                   cy="50%"
                   innerRadius={80}
                   outerRadius={120}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {data.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <RechartsTooltip />
                 <Legend verticalAlign="bottom" height={36}/>
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="glass-panel p-6 overflow-hidden flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Clock className="h-5 w-5 text-[#1428A0]" />
            <span>Cases Nearing Breach (&lt; 1 Hour)</span>
          </h2>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="bg-orange-50/50 border border-orange-100 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-[#1428A0]">CS001{i}24</span>
                  <p className="text-sm font-semibold text-gray-800">Critical Server Outage</p>
                  <p className="text-xs text-gray-500 mt-1">Assigned: Network Team</p>
                </div>
                <div className="text-right">
                   <span className="text-orange-600 font-bold bg-orange-100 px-3 py-1 rounded-lg text-sm flex items-center space-x-1">
                     <Clock className="w-3 h-3"/> <span>45 min</span>
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlaMonitoring;
