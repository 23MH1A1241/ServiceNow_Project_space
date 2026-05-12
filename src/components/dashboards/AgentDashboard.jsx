import React, { useState, useEffect } from 'react';
import { 
  Briefcase, AlertOctagon, CheckCircle, TrendingUp, 
  Sparkles, Zap, ChevronRight, BrainCircuit, Search,
  Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAgentMetrics } from '../../api/serviceNow';
import { getAIResolution } from '../../api/ai';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const AgentDashboard = ({ user }) => {
  const [metrics, setMetrics] = useState({ assigned: 0, critical: 0, resolved: 0, escalated: 0, recent: [] });
  const [loading, setLoading] = useState(true);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAgentMetrics(user.user_name, user.sys_id);
        setMetrics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleAiAsk = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    try {
      const res = await getAIResolution(aiQuery, 'agent', { user: user.name });
      setAiResponse(res);
    } catch (err) {
      setAiResponse("Neural link failed. Retry connection.");
    } finally {
      setAiLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];
  const pieData = [
    { name: 'Active', value: Math.max(metrics.assigned - metrics.resolved, 0) || 1 },
    { name: 'Critical', value: metrics.critical || 0 },
    { name: 'Resolved', value: metrics.resolved || 0 }
  ].filter(d => d.value > 0);

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
      ></motion.div>
    </div>
  );

  return (
    <div className="space-y-12 font-outfit">
      {/* Stats Header */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { title: 'Open Cases', value: metrics.assigned, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50' },
          { title: 'SLA Risk', value: metrics.critical, icon: AlertOctagon, color: 'text-red-500', bg: 'bg-red-50' },
          { title: 'Daily Resolved', value: metrics.resolved, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { title: 'Escalations', value: metrics.escalated, icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={idx}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
              whileHover={{ y: -5 }}
              className="glass-panel p-8 group hover:border-blue-500/20 transition-all flex items-center justify-between shadow-lg hover:shadow-xl"
            >
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{stat.title}</p>
                <p className="text-4xl font-black text-gray-900 tracking-tighter group-hover:scale-105 transition-transform origin-left">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center shadow-inner`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Work Table */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass-panel p-10 shadow-lg"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Active Workload</h2>
            <div className="px-3 py-1 bg-[#020617] text-white rounded-lg text-[9px] font-black uppercase tracking-widest animate-pulse">Live</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reference</th>
                  <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Context</th>
                  <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">SLA</th>
                  <th className="pb-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {metrics.recent.map((c, i) => (
                  <motion.tr 
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="py-5">
                       <span className="text-sm font-black text-blue-600 tracking-tighter">{c.number}</span>
                    </td>
                    <td className="py-5">
                       <p className="text-sm font-bold text-gray-700 truncate max-w-[200px]">{c.short_description}</p>
                    </td>
                    <td className="py-5">
                        <div className="flex items-center space-x-3">
                           <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full ${c.priority === '1' ? 'bg-red-500 w-4/5' : 'bg-blue-500 w-1/3'}`}></div>
                           </div>
                           <span className={`text-[10px] font-black uppercase ${c.priority === '1' ? 'text-red-500' : 'text-gray-400'}`}>
                              {c.priority === '1' ? '82%' : '14%'}
                           </span>
                        </div>
                    </td>
                    <td className="py-5 text-right">
                       <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* AI Guidance Sidepanel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
           <div className="glass-panel p-10 bg-[#020617] text-white border-white/5 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full blur-3xl"></div>
              <div className="flex items-center space-x-3 mb-8 relative z-10">
                 <BrainCircuit className="text-blue-400 w-6 h-6" />
                 <h2 className="text-lg font-black tracking-tight">AI Neural Engine</h2>
              </div>
              
              <form onSubmit={handleAiAsk} className="relative z-10 mb-8">
                 <div className="relative group">
                    <input
                      type="text"
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      placeholder="Ask for resolution guide..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-4 text-sm font-bold text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-blue-400" />
                 </div>
                 <motion.button 
                   whileTap={{ scale: 0.98 }}
                   type="submit"
                   disabled={aiLoading}
                   className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg shadow-blue-900/20"
                 >
                   {aiLoading ? "Neural Processing..." : "Generate Guide"}
                 </motion.button>
              </form>

              <AnimatePresence mode="wait">
                {aiResponse ? (
                  <motion.div 
                    key="response"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 relative z-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar"
                  >
                     <div className="flex items-center space-x-2 text-blue-400">
                        <Terminal className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Resolution Steps</span>
                     </div>
                     <div className="text-[12px] font-medium leading-relaxed text-white/70 whitespace-pre-wrap">
                        {aiResponse}
                     </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 relative z-10"
                  >
                     <Sparkles className="w-8 h-8 text-white/10 mx-auto mb-4" />
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Enter an issue for AI guidance</p>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           <motion.div 
             whileHover={{ scale: 1.02 }}
             className="glass-panel p-10 flex flex-col items-center justify-center shadow-lg"
           >
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Queue Health</h2>
              <div className="w-full h-[150px] relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                   <p className="text-2xl font-black text-gray-900 leading-none">{metrics.assigned}</p>
                   <p className="text-[8px] font-black text-gray-400 uppercase mt-1">Total</p>
                </div>
              </div>
           </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AgentDashboard;
