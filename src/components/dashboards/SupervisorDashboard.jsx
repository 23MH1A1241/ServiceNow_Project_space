import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, Clock, Target } from 'lucide-react';
import { fetchSupervisorMetrics } from '../../api/serviceNow';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const SupervisorDashboard = () => {
  const [metrics, setMetrics] = useState({ totalActive: 0, escalated: 0, unassigned: 0, criticalAlerts: 0, recent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSupervisorMetrics();
      setMetrics(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Mocking agent performance data based on total volume for the chart
  const agentData = [
    { name: 'Agent 1', cases: Math.floor(metrics.totalActive * 0.4) || 12 },
    { name: 'Agent 2', cases: Math.floor(metrics.totalActive * 0.35) || 10 },
    { name: 'Agent 3', cases: Math.floor(metrics.totalActive * 0.25) || 7 },
  ];

  if (loading) return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-samsung-blue mx-auto mt-20"></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Team Queue', value: metrics.totalActive, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Unassigned', value: metrics.unassigned, icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100' },
          { title: 'Escalations', value: metrics.escalated, icon: Target, color: 'text-orange-600', bg: 'bg-orange-50' },
          { title: 'Critical Alerts', value: metrics.criticalAlerts, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card flex flex-col justify-center p-6 text-center group hover:bg-white transition-all">
              <div className={`w-12 h-12 mx-auto rounded-xl ${stat.bg} flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform`}><Icon className={`h-6 w-6 ${stat.color}`} /></div>
              <p className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h2 className="text-lg font-extrabold text-gray-900 mb-6">Agent Workload Comparison</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EAEAEA" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontWeight: 'bold'}} />
                <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="cases" fill="#1428A0" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h2 className="text-lg font-extrabold text-gray-900 mb-4 text-red-600">Attention Required (SLA & Escalations)</h2>
          <div className="space-y-3 overflow-y-auto max-h-64 pr-2">
             {metrics.recent.filter(c => c.priority === '1' || c.escalation === '1' || !c.assigned_to).length === 0 ? (
                 <div className="p-8 text-center bg-green-50 rounded-xl border border-green-100">
                     <p className="text-green-700 font-bold">All queues healthy. No immediate attention required.</p>
                 </div>
             ) : (
                metrics.recent.filter(c => c.priority === '1' || c.escalation === '1' || !c.assigned_to).map((c, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-red-50/50 border border-red-100 rounded-xl">
                        <div>
                            <p className="font-bold text-gray-900">{c.number}</p>
                            <p className="text-sm text-gray-600 truncate max-w-[200px]">{c.short_description}</p>
                        </div>
                        <div className="text-right">
                            {!c.assigned_to && <span className="block text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded mb-1">Unassigned</span>}
                            {c.priority === '1' && <span className="block text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">P1 Critical</span>}
                        </div>
                    </div>
                ))
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
