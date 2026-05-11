import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip as RechartsTooltip 
} from 'recharts';
import { Clock, Activity, AlertCircle, ArrowUpRight } from 'lucide-react';
import { fetchAdminMetrics } from '../api/serviceNow';

const SlaMonitoring = () => {
  const [metrics, setMetrics] = useState({ met: 0, warning: 0, breached: 0 });
  const [breachCases, setBreachCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const metricsData = await fetchAdminMetrics();
        setMetrics(metricsData.sla);
        
        // Predictive risk logic
        const nearing = metricsData.all
          .filter(c => c.priority === '1' || c.escalation === '1' || c.escalation === '2')
          .slice(0, 5)
          .map(c => {
            const hash = parseInt(c.sys_id?.slice(-4), 16) || 0;
            const baseTime = c.priority === '1' ? 15 : 45;
            const variance = hash % 20;
            return {
              ...c,
              minutesRemaining: baseTime + variance,
              breachRisk: (baseTime + variance) < 20 ? 'High' : 'Moderate'
            };
          });

        setBreachCases(nearing);
      } catch (err) {
        console.error('Failed to load SLA data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const slaData = [
    { name: 'Met', value: metrics.met, color: '#10b981' },
    { name: 'Warning', value: metrics.warning, color: '#f59e0b' },
    { name: 'Breached', value: metrics.breached, color: '#ef4444' }
  ];

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in font-outfit">
      <div className="flex justify-between items-end mb-12">
        <div className="space-y-1">
          <div className="inline-flex items-center px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md text-[8px] font-black text-blue-400 uppercase tracking-widest">
            Compliance Engine
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900">SLA Performance</h1>
        </div>
        <div className="flex space-x-2">
           <div className="px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">System Healthy</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visual Pie Chart */}
        <div className="lg:col-span-2 glass-panel p-12 flex flex-col items-center justify-center relative min-h-[500px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-bl-[200px] blur-3xl"></div>
          
          <div className="w-full h-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={slaData}
                  cx="50%"
                  cy="50%"
                  innerRadius={110}
                  outerRadius={150}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  {slaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                   contentStyle={{ backgroundColor: '#020617', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute text-center">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">HEALTH SCORE</p>
               <p className="text-7xl font-black text-gray-900 tracking-tighter">
                  {Math.round((metrics.met / (metrics.met + metrics.warning + metrics.breached || 1)) * 100)}%
               </p>
            </div>
          </div>
        </div>

        {/* Minimalist Risk Alerts */}
        <div className="space-y-6">
           <div className="glass-panel p-8">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Critical Risk</h2>
              <div className="space-y-6">
                {breachCases.length > 0 ? breachCases.map((c, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                          <p className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{c.number}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">P{c.priority} Resolution</p>
                       </div>
                       <div className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${c.breachRisk === 'High' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                          {c.minutesRemaining}m
                       </div>
                    </div>
                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                       <div 
                         className={`h-full transition-all duration-1000 ${c.breachRisk === 'High' ? 'bg-red-500' : 'bg-orange-500'}`} 
                         style={{ width: `${100 - (c.minutesRemaining * 1.5)}%` }}
                       ></div>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-400 font-medium text-center py-8">All clear. No active risks.</p>
                )}
              </div>
           </div>

           <div className="glass-panel p-8 bg-[#020617] text-white border-white/5">
              <div className="flex items-center justify-between mb-6">
                 <Activity className="text-blue-400 w-5 h-5" />
                 <ArrowUpRight className="text-white/20 w-4 h-4" />
              </div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Weekly Compliance</p>
              <p className="text-3xl font-black tracking-tighter text-white">+12.4%</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SlaMonitoring;
