import React, { useState, useEffect } from 'react';
import { Users, Search, TrendingUp, AlertCircle, ArrowUpRight } from 'lucide-react';
import { fetchAgentSlaMetrics } from '../api/serviceNow';

const AgentSlaTracking = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAgentSlaMetrics();
        setAgents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filtered = agents.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in font-outfit">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md text-[8px] font-black text-blue-400 uppercase tracking-widest">
            Executive View
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900">Agent Performance</h1>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-6 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/30 transition-all font-bold text-sm shadow-sm"
            placeholder="Search agents..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((agent, i) => (
          <div key={i} className="glass-panel p-10 group hover:border-blue-500/30 transition-all flex flex-col relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
             
             <div className="flex items-center space-x-4 mb-8">
                <div className="w-14 h-14 bg-[#020617] rounded-2xl flex items-center justify-center text-blue-400 shadow-2xl relative">
                   <Users className="w-7 h-7" />
                   {agent.score > 90 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                   )}
                </div>
                <div>
                   <h3 className="text-xl font-black text-gray-900 tracking-tight">{agent.name}</h3>
                   <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">L2 Support Specialist</p>
                </div>
             </div>

             <div className="grid grid-cols-3 gap-4 mb-8">
                <div>
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">MET</p>
                   <p className="text-xl font-black text-green-600">{agent.met}</p>
                </div>
                <div>
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">WARNING</p>
                   <p className="text-xl font-black text-orange-500">{agent.warning}</p>
                </div>
                <div>
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">BREACH</p>
                   <p className="text-xl font-black text-red-500">{agent.breached}</p>
                </div>
             </div>

             <div className="pt-8 border-t border-gray-50 mt-auto flex items-center justify-between">
                <div className="flex flex-col">
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Efficiency Score</p>
                   <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <span className="text-lg font-black text-gray-900">{agent.score}%</span>
                   </div>
                </div>
                <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-[#020617] group-hover:text-white transition-all">
                   <ArrowUpRight className="w-5 h-5" />
                </button>
             </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-24 text-center glass-panel border-dashed">
          <AlertCircle className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <p className="text-lg font-black text-gray-400 tracking-tight">No agents found</p>
        </div>
      )}
    </div>
  );
};

export default AgentSlaTracking;
