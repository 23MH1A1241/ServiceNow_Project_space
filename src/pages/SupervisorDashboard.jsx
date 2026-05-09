import React from 'react';
import { Users, AlertTriangle, Briefcase, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Hardware', cases: 45, slaBreaches: 4 },
  { name: 'Software', cases: 80, slaBreaches: 12 },
  { name: 'Network', cases: 35, slaBreaches: 2 },
  { name: 'Billing', cases: 55, slaBreaches: 8 },
];

const SupervisorDashboard = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Supervisor Dashboard</h1>
          <p className="text-gray-500 mt-2">Team performance, SLA monitoring, and assignment analytics.</p>
        </div>
        <div className="text-sm font-semibold px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 shadow-sm">
          Supervisor View
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card flex items-center space-x-4 border-t-4 border-indigo-500">
          <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600"><Users className="h-7 w-7" /></div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Agents Online</p>
            <p className="text-3xl font-extrabold text-gray-900">12 / 15</p>
          </div>
        </div>
        <div className="glass-card flex items-center space-x-4 border-t-4 border-blue-500">
          <div className="p-4 bg-blue-50 rounded-2xl text-blue-600"><Briefcase className="h-7 w-7" /></div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Team Open Cases</p>
            <p className="text-3xl font-extrabold text-gray-900">142</p>
          </div>
        </div>
        <div className="glass-card flex items-center space-x-4 border-t-4 border-red-500">
          <div className="p-4 bg-red-50 rounded-2xl text-red-600"><AlertTriangle className="h-7 w-7" /></div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">SLA Breaches</p>
            <p className="text-3xl font-extrabold text-gray-900">26</p>
          </div>
        </div>
        <div className="glass-card flex items-center space-x-4 border-t-4 border-green-500">
          <div className="p-4 bg-green-50 rounded-2xl text-green-600"><TrendingUp className="h-7 w-7" /></div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">CSAT Score</p>
            <p className="text-3xl font-extrabold text-gray-900">4.8</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Case Volume by Category vs SLA Breaches</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }}/>
              <Bar dataKey="cases" fill="#1428A0" name="Total Cases" radius={[4, 4, 0, 0]} barSize={40} />
              <Bar dataKey="slaBreaches" fill="#EF4444" name="SLA Breaches" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
