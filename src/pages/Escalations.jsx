import React, { useState, useEffect } from 'react';
import { AlertTriangle, User, ArrowUpRight } from 'lucide-react';
import { fetchEscalatedCases } from '../api/serviceNow';

const Escalations = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchEscalatedCases();
      setCases(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-samsung-blue mx-auto mt-20"></div>;
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Active Escalations</h1>
          <p className="text-gray-500 mt-2">Monitor and manage high-priority escalated cases.</p>
        </div>
      </div>

      <div className="glass-panel p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-4 font-semibold text-gray-500 text-sm uppercase tracking-wider">Case Number</th>
                <th className="pb-4 font-semibold text-gray-500 text-sm uppercase tracking-wider">Priority</th>
                <th className="pb-4 font-semibold text-gray-500 text-sm uppercase tracking-wider">Assigned To</th>
                <th className="pb-4 font-semibold text-gray-500 text-sm uppercase tracking-wider">Escalation Reason</th>
                <th className="pb-4 font-semibold text-gray-500 text-sm uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cases.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500 font-medium">No active escalations found.</td>
                </tr>
              ) : cases.map((c, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4">
                    <span className="font-bold text-[#1428A0]">{c.number}</span>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${c.priority === '1' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                      {c.priority === '1' ? 'Critical' : 'High'}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#1428A0]">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-900">{typeof c.assigned_to === 'object' ? c.assigned_to.display_value : (c.assigned_to || 'Unassigned')}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-gray-600 truncate max-w-[200px] block">{c.short_description}</span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="text-[#1428A0] hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-semibold inline-flex items-center space-x-1 transition-colors">
                      <span>Review</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Escalations;
