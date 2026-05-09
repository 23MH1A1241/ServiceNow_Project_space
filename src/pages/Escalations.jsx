import React from 'react';
import { AlertTriangle, User, ArrowUpRight } from 'lucide-react';

const Escalations = () => {
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
              {[1, 2, 3].map((item) => (
                <tr key={item} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4">
                    <span className="font-bold text-[#1428A0]">CS002{item}45</span>
                  </td>
                  <td className="py-4">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Critical</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#1428A0]">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-900">Agent {item}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-gray-600">Customer requested management review</span>
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
