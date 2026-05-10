import React, { useState, useEffect } from 'react';
import { Briefcase, AlertOctagon, CheckCircle, TrendingUp } from 'lucide-react';
import { fetchAgentMetrics } from '../../api/serviceNow';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const AgentDashboard = ({ user }) => {
  const [metrics, setMetrics] = useState({ assigned: 0, critical: 0, resolved: 0, escalated: 0, recent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAgentMetrics(user.user_name, user.sys_id);
      setMetrics(data);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const COLORS = ['#1428A0', '#EF4444', '#10B981', '#F59E0B'];
  const pieData = [
    { name: 'Active Workload', value: Math.max(metrics.assigned - metrics.resolved, 0) || 1 },
    { name: 'Critical Priority', value: metrics.critical || 0 },
    { name: 'Recently Resolved', value: metrics.resolved || 0 }
  ].filter(d => d.value > 0);

  if (loading) return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-samsung-blue mx-auto mt-20"></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'My Open Work', value: metrics.assigned, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Critical SLA', value: metrics.critical, icon: AlertOctagon, color: 'text-red-600', bg: 'bg-red-50' },
          { title: 'Resolved Today', value: metrics.resolved, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { title: 'Escalated Cases', value: metrics.escalated, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{stat.title}</p>
                <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bg}`}><Icon className={`h-6 w-6 ${stat.color}`} /></div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6">
          <h2 className="text-lg font-extrabold text-gray-900 mb-4">My Assigned Cases</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase">Case Number</th>
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase">Short Description</th>
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase">Priority</th>
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase">SLA Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {metrics.recent.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                    <td className="py-4 text-sm font-bold text-samsung-blue">{c.number}</td>
                    <td className="py-4 text-sm font-medium text-gray-700 truncate max-w-xs">{c.short_description}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${c.priority === '1' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        P{c.priority}
                      </span>
                    </td>
                    <td className="py-4">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full ${c.priority === '1' ? 'bg-red-500 w-4/5' : 'bg-samsung-blue w-1/3'}`}></div>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col">
          <h2 className="text-lg font-extrabold text-gray-900 mb-2">Workload Distribution</h2>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
             {pieData.map((entry, index) => (
                 <div key={index} className="flex items-center text-xs font-bold text-gray-600">
                     <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                     {entry.name}
                 </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
