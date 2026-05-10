import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { fetchCustomerMetrics } from '../../api/serviceNow';

const CustomerDashboard = ({ user }) => {
  const [metrics, setMetrics] = useState({ open: 0, resolved: 0, escalated: 0, recent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCustomerMetrics(user.sys_id);
      setMetrics(data);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-samsung-blue mx-auto mt-20"></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full bg-blue-50 opacity-50 group-hover:scale-150 transition-transform"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">My Open Cases</p>
                <p className="text-4xl font-extrabold text-gray-900">{metrics.open}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100"><Activity className="h-6 w-6 text-blue-600" /></div>
            </div>
        </div>
        <div className="glass-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full bg-emerald-50 opacity-50 group-hover:scale-150 transition-transform"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">My Resolved</p>
                <p className="text-4xl font-extrabold text-gray-900">{metrics.resolved}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100"><CheckCircle2 className="h-6 w-6 text-emerald-600" /></div>
            </div>
        </div>
        <div className="glass-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full bg-orange-50 opacity-50 group-hover:scale-150 transition-transform"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Escalated</p>
                <p className="text-4xl font-extrabold text-gray-900">{metrics.escalated}</p>
              </div>
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-100"><AlertTriangle className="h-6 w-6 text-orange-600" /></div>
            </div>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-samsung-blue" />
            My Recent Case Activity
        </h2>
        <div className="space-y-4">
          {metrics.recent.length === 0 ? (
              <p className="text-sm text-gray-500 font-medium p-4 bg-gray-50 rounded-xl">No active cases found.</p>
          ) : (
            metrics.recent.map((c, i) => (
              <div key={i} className="p-5 bg-gray-50/80 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-extrabold text-samsung-blue">{c.number}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${c.state === '3' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                      {c.state === '3' ? 'Resolved' : 'Active'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-400">{new Date(c.sys_created_on).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">{c.short_description}</p>
                
                {/* Timeline UI */}
                {c.state !== '3' && (
                  <div className="mt-5 pt-5 border-t border-gray-200/60">
                    <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                      <span>Submitted</span>
                      <span className="text-samsung-blue">In Review</span>
                      <span>Resolved</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
                        <div className="h-full bg-samsung-blue w-1/2 rounded-full samsung-gradient"></div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
