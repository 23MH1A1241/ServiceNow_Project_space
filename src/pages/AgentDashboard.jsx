import React, { useState, useEffect } from 'react';
import { getDashboardMetrics } from '../api/serviceNow';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, AlertCircle, CheckCircle2, Clock, Activity, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', open: 12, resolved: 15 },
  { name: 'Tue', open: 19, resolved: 12 },
  { name: 'Wed', open: 15, resolved: 20 },
  { name: 'Thu', open: 22, resolved: 18 },
  { name: 'Fri', open: 28, resolved: 25 },
  { name: 'Sat', open: 14, resolved: 10 },
  { name: 'Sun', open: 8, resolved: 5 },
];

const AgentDashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getDashboardMetrics('agent', user.user_name);
        setMetrics(data);
      } catch (err) {
        console.error("Dashboard metrics failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [user]);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#1428A0]" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Work Dashboard</h1>
          <p className="text-gray-500 mt-2">Manage your assigned cases and monitor SLA warnings.</p>
        </div>
        <div className="text-sm font-semibold px-4 py-2 bg-blue-50 text-[#1428A0] rounded-xl border border-blue-100 shadow-sm">
          Agent View
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card flex items-center space-x-4">
          <div className="p-4 bg-blue-50 rounded-2xl text-[#1428A0]"><LayoutDashboard className="h-7 w-7" /></div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">My Open</p>
            <p className="text-3xl font-extrabold text-gray-900">{metrics?.active || 0}</p>
          </div>
        </div>
        <div className="glass-card flex items-center space-x-4">
          <div className="p-4 bg-red-50 rounded-2xl text-red-600"><AlertCircle className="h-7 w-7" /></div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Critical</p>
            <p className="text-3xl font-extrabold text-gray-900">{metrics?.critical || 0}</p>
          </div>
        </div>
        <div className="glass-card flex items-center space-x-4">
          <div className="p-4 bg-orange-50 rounded-2xl text-orange-500"><Clock className="h-7 w-7" /></div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">SLA Warning</p>
            <p className="text-3xl font-extrabold text-gray-900">{Math.floor((metrics?.active || 0) * 0.2)}</p>
          </div>
        </div>
        <div className="glass-card flex items-center space-x-4">
          <div className="p-4 bg-green-50 rounded-2xl text-green-600"><CheckCircle2 className="h-7 w-7" /></div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Resolved</p>
            <p className="text-3xl font-extrabold text-gray-900">{metrics?.resolved || 0}</p>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="h-5 w-5 text-[#1428A0]" />
            <h2 className="text-xl font-bold text-gray-900">Weekly Case Volume</h2>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1428A0" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1428A0" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="open" stroke="#1428A0" strokeWidth={3} fillOpacity={1} fill="url(#colorOpen)" name="Open Cases" />
                <Area type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorResolved)" name="Resolved Cases" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Assigned Cases List */}
        <div className="glass-panel p-6 flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">My Assigned Cases</h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {metrics?.recent?.length > 0 ? (
              metrics.recent.map((c, i) => (
                <div key={i} className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md cursor-pointer transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-[#1428A0]">{c.number}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${c.priority === '1' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'}`}>
                      P{c.priority}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2">{c.short_description}</p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <CheckCircle2 className="h-10 w-10 mb-2 opacity-50" />
                <p>No open cases assigned.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
