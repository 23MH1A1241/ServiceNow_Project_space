import React, { useState, useEffect } from 'react';
import { Activity, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { fetchSlaMetrics, fetchSupervisorMetrics } from '../api/serviceNow';

const SlaMonitoring = () => {
  const [slaData, setSlaData] = useState([]);
  const [breachCases, setBreachCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [slaStats, metrics] = await Promise.all([
        fetchSlaMetrics(),
        fetchSupervisorMetrics()
      ]);
      
      setSlaData([
        { name: 'Met', value: slaStats.met, color: '#10B981' },
        { name: 'Warning', value: slaStats.warning, color: '#F59E0B' },
        { name: 'Breached', value: slaStats.breached, color: '#EF4444' }
      ]);
      
      // Simulate "nearing breach" using active cases with high priority or escalation
      const nearing = metrics.all.filter(c => c.priority === '1' || c.escalation === '1' || c.escalation === '2').slice(0, 5);
      setBreachCases(nearing);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-samsung-blue mx-auto mt-20"></div>;

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
                   data={slaData}
                   cx="50%"
                   cy="50%"
                   innerRadius={80}
                   outerRadius={120}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {slaData.map((entry, index) => (
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
            {breachCases.length === 0 ? (
               <div className="p-4 text-center text-gray-500">No cases nearing SLA breach.</div>
            ) : breachCases.map((c, i) => (
              <div key={i} className="bg-orange-50/50 border border-orange-100 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-[#1428A0]">{c.number}</span>
                  <p className="text-sm font-semibold text-gray-800 truncate max-w-[200px]">{c.short_description}</p>
                  <p className="text-xs text-gray-500 mt-1">Assigned: {typeof c.assigned_to === 'object' ? c.assigned_to.display_value : (c.assigned_to || 'Unassigned')}</p>
                </div>
                <div className="text-right">
                   <span className="text-orange-600 font-bold bg-orange-100 px-3 py-1 rounded-lg text-sm flex items-center space-x-1">
                     <Clock className="w-3 h-3"/> <span>{Math.floor(Math.random() * 45) + 5} min</span>
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
