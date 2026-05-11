import React, { useState, useEffect } from 'react';
import { fetchEscalatedCases } from '../api/serviceNow';
import { AlertTriangle, Clock, ArrowUpRight, Shield } from 'lucide-react';

const Escalations = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchEscalatedCases();
        setCases(data);
      } catch (err) {
        console.error('Failed to load escalations', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getEscRule = (c) => {
    if (c.priority === '1') return 'ESC-001';
    if (c.priority === '2') return 'ESC-002';
    if (c.reassignment_count > 3) return 'ESC-003';
    return 'ESC-007';
  };

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in font-outfit">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="inline-flex items-center px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-md text-[8px] font-black text-red-500 uppercase tracking-widest">
            High Severity
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900">Active Escalations</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.length > 0 ? cases.map((c, i) => (
          <div key={i} className="glass-panel p-8 group hover:border-red-500/20 transition-all flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex justify-between items-start mb-8">
                 <div className="p-3 bg-red-50 rounded-2xl">
                    <AlertTriangle className="text-red-500 w-6 h-6" />
                 </div>
                 <div className="px-3 py-1 bg-gray-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {getEscRule(c)}
                 </div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight group-hover:text-red-600 transition-colors">
                {c.number}
              </h3>
              <p className="text-sm text-gray-400 font-medium line-clamp-2 mb-6">
                {c.short_description}
              </p>
            </div>
            
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
               <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-300" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     {new Date(c.sys_created_on).toLocaleDateString()}
                  </span>
               </div>
               <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
                  <ArrowUpRight className="w-5 h-5" />
               </button>
            </div>
          </div>
        )) : (
          <div className="lg:col-span-3 py-20 text-center">
             <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-green-500 w-10 h-10" />
             </div>
             <p className="text-xl font-black text-gray-900">No active escalations</p>
             <p className="text-gray-400 font-medium">All high-priority cases are currently within SLA.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Escalations;
