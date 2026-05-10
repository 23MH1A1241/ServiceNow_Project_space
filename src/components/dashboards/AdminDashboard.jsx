import React, { useState, useEffect } from 'react';
import { Database, Zap, Activity, Users } from 'lucide-react';
import { fetchAdminMetrics } from '../../api/serviceNow';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({ total: 0, open: 0, resolved: 0, escalated: 0, priorityDistribution: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAdminMetrics();
      setMetrics(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // System volume trend (Mocked based on total for visual effect)
  const volumeData = [
    { name: 'Mon', volume: Math.floor(metrics.total * 0.1) || 20 },
    { name: 'Tue', volume: Math.floor(metrics.total * 0.15) || 30 },
    { name: 'Wed', volume: Math.floor(metrics.total * 0.25) || 45 },
    { name: 'Thu', volume: Math.floor(metrics.total * 0.2) || 40 },
    { name: 'Fri', volume: Math.floor(metrics.total * 0.3) || 55 },
  ];

  if (loading) return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-samsung-blue mx-auto mt-20"></div>;

  return (
    <div className="space-y-6">
      <div className="p-6 bg-[#0A1450] rounded-2xl text-white shadow-xl flex justify-between items-center relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>
         <div className="relative z-10">
             <h2 className="text-2xl font-extrabold tracking-tight">System Global Analytics</h2>
             <p className="text-blue-200 mt-1">Live from ServiceNow Zurich Instance (dev296999)</p>
         </div>
         <div className="relative z-10 text-right">
             <p className="text-4xl font-black">{metrics.total}</p>
             <p className="text-xs font-bold uppercase tracking-widest text-blue-300 mt-1">Total System Cases</p>
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'Open', value: metrics.open, icon: Activity, color: 'text-blue-600' },
          { title: 'Resolved', value: metrics.resolved, icon: Zap, color: 'text-emerald-600' },
          { title: 'Escalated', value: metrics.escalated, icon: Database, color: 'text-orange-600' },
          { title: 'Active Users', value: '42', icon: Users, color: 'text-purple-600' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center space-x-4">
              <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}><Icon className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900 leading-none">{stat.value}</p>
                <p className="text-xs font-bold text-gray-500 uppercase mt-1">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6">
          <h2 className="text-lg font-extrabold text-gray-900 mb-6">System Ingestion Volume</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1428A0" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1428A0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}/>
                <Area type="monotone" dataKey="volume" stroke="#1428A0" strokeWidth={3} fillOpacity={1} fill="url(#colorSys)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h2 className="text-lg font-extrabold text-gray-900 mb-6">Priority Distribution</h2>
          <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-red-600">P1 - Critical</span>
                  <span>{metrics.priorityDistribution.p1 || 0}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{width: `${Math.max((metrics.priorityDistribution.p1 / Math.max(metrics.total, 1)) * 100, 2)}%`}}></div>
              </div>

              <div className="flex justify-between items-center text-sm font-bold mt-4">
                  <span className="text-orange-600">P2 - High</span>
                  <span>{metrics.priorityDistribution.p2 || 0}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{width: `${Math.max((metrics.priorityDistribution.p2 / Math.max(metrics.total, 1)) * 100, 5)}%`}}></div>
              </div>

              <div className="flex justify-between items-center text-sm font-bold mt-4">
                  <span className="text-blue-600">P3 - Moderate</span>
                  <span>{metrics.priorityDistribution.p3 || 0}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: `${Math.max((metrics.priorityDistribution.p3 / Math.max(metrics.total, 1)) * 100, 10)}%`}}></div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
