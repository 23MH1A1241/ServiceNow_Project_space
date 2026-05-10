import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2, AlertCircle, Clock, User, Tag, FileText, CheckCircle2 } from 'lucide-react';
import { getCase } from '../api/serviceNow';

const TrackCase = () => {
  const [searchParams] = useSearchParams();
  const initialNumber = searchParams.get('number') || '';
  
  const [caseNumber, setCaseNumber] = useState(initialNumber);
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!caseNumber) return;

    setLoading(true);
    setError('');
    setCaseData(null);

    try {
      const result = await getCase(caseNumber);
      if (result) {
        setCaseData(result);
      } else {
        setError('Case not found. Please check the number and try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Error retrieving case data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialNumber) {
      handleSearch();
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">Track Case Status</h1>
        <p className="text-gray-500 mt-2 text-lg">Enter your case number to get real-time timeline updates.</p>
      </div>

      <div className="flex justify-center">
        <form onSubmit={handleSearch} className="flex w-full max-w-xl glass-panel p-2 shadow-md">
          <input
            type="text"
            value={caseNumber}
            onChange={(e) => setCaseNumber(e.target.value)}
            className="flex-1 px-5 py-3 bg-transparent border-none focus:ring-0 text-lg font-medium text-gray-900 outline-none"
            placeholder="e.g. CS0001001"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary rounded-lg py-3 px-8"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-center text-red-600 flex flex-col items-center shadow-sm">
          <AlertCircle className="h-10 w-10 mb-3" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {caseData && (
        <div className="glass-panel p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-start mb-8 pb-8 border-b border-gray-100">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-3xl font-extrabold text-gray-900">{caseData.number}</h2>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border shadow-sm ${
                  caseData.state === '3' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-[#1428A0] border-blue-200'
                }`}>
                  {caseData.state === '3' ? 'Closed' : 'Active'}
                </span>
              </div>
              <p className="text-xl text-gray-600 font-medium">{caseData.short_description}</p>
            </div>
          </div>

          {/* Timeline Visualizer */}
          <div className="mb-10">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">SLA Progress</h3>
             <div className="relative pt-1">
               <div className="flex mb-2 items-center justify-between">
                 <div>
                   <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#1428A0] bg-blue-100">
                     In Progress
                   </span>
                 </div>
                 <div className="text-right">
                   <span className="text-xs font-semibold inline-block text-[#1428A0]">
                     45%
                   </span>
                 </div>
               </div>
               <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-blue-100">
                 <div style={{ width: "45%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center samsung-gradient animate-pulse"></div>
               </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-gray-50 rounded-lg"><Tag className="h-5 w-5 text-gray-500" /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Priority</p>
                  <p className="font-bold text-gray-900">Level {caseData.priority}</p>
                </div>
              </div>
              

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-gray-50 rounded-lg"><Clock className="h-5 w-5 text-gray-500" /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Created</p>
                  <p className="font-bold text-gray-900">{new Date(caseData.sys_created_on).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start space-x-3 mb-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <p className="text-sm font-semibold text-gray-500">Description</p>
              </div>
              <div className="bg-gray-50/50 rounded-xl p-5 text-gray-700 text-sm whitespace-pre-wrap border border-gray-100 shadow-inner">
                {caseData.description || 'No detailed description provided.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackCase;
