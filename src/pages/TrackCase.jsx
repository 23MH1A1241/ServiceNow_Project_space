import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2, AlertCircle, Clock, Tag, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCase, triggerAgentMatching, submitCsat, getCaseSlaPercentage } from '../api/serviceNow';

const TrackCase = () => {
  const [searchParams] = useSearchParams();
  const initialNumber = searchParams.get('number') || '';
  
  const [caseNumber, setCaseNumber] = useState(initialNumber);
  const [caseData, setCaseData] = useState(null);
  const [slaPercentage, setSlaPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [csatRating, setCsatRating] = useState(0);
  const [matchingLoading, setMatchingLoading] = useState(false);

  const handleSearch = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (!caseNumber) return;

    setLoading(true);
    setError('');
    setCaseData(null);

    try {
      const result = await getCase(caseNumber);
      if (result) {
        setCaseData(result);
        const sla = await getCaseSlaPercentage(result.sys_id);
        setSlaPercentage(sla);
      } else {
        setError('Case not found. Please check the number and try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Error retrieving case data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [caseNumber]);

  useEffect(() => {
    if (initialNumber) {
      handleSearch();
    }
  }, [initialNumber, handleSearch]);

  const getStateLabel = (state) => {
    switch(state) {
      case '1': return 'New';
      case '2': return 'In Progress';
      case '3': return 'Closed';
      case '4': return 'Canceled';
      case '7': return 'Resolved';
      default: return 'Active';
    }
  };

  const isClosed = caseData?.state === '3' || caseData?.state === '4' || caseData?.state === '7';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-extrabold text-gray-900">Track Case Status</h1>
        <p className="text-gray-500 mt-2 text-lg">Enter your case number for real-time SLA and routing updates.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center"
      >
        <form onSubmit={handleSearch} className="flex w-full max-w-xl glass-panel p-2 shadow-lg border-blue-100/50">
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
            className="btn-primary rounded-lg py-3 px-8 shadow-blue-200 shadow-lg"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          </button>
        </form>
      </motion.div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 bg-red-50 border border-red-100 rounded-2xl text-center text-red-600 flex flex-col items-center shadow-sm"
          >
            <AlertCircle className="h-10 w-10 mb-3" />
            <p className="font-bold tracking-wide">{error}</p>
          </motion.div>
        )}

        {caseData && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-10 relative overflow-hidden border border-white shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-samsung-blue opacity-[0.03] rounded-bl-[100px]"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-gray-100">
              <div>
                <div className="flex items-center space-x-4 mb-3">
                  <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{caseData.number}</h2>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold border shadow-sm tracking-wider uppercase ${
                    isClosed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-samsung-blue border-blue-200'
                  }`}>
                    {getStateLabel(caseData.state)}
                  </span>
                </div>
                <p className="text-xl text-gray-600 font-medium">{caseData.short_description}</p>
              </div>
              {!isClosed && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    setMatchingLoading(true);
                    await triggerAgentMatching(caseData.sys_id);
                    setMatchingLoading(false);
                    alert('AI Routing engine has been triggered to optimize agent assignment.');
                  }}
                  disabled={matchingLoading}
                  className="mt-4 md:mt-0 text-sm font-bold text-samsung-blue bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl border border-blue-200 transition-all flex items-center space-x-2"
                >
                  {matchingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>⚡ AI Re-assign</span>}
                </motion.button>
              )}
            </div>

            {/* Timeline Visualizer */}
            <div className="mb-10">
               <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Real-time SLA Progress</h3>
               <div className="relative pt-1">
                 <div className="flex mb-2 items-center justify-between">
                   <div>
                     <span className="text-xs font-bold inline-block py-1 px-3 uppercase rounded-full text-samsung-blue bg-blue-50 border border-blue-100">
                       Time Elapsed (Live)
                     </span>
                   </div>
                   <div className="text-right">
                     <span className="text-xs font-bold inline-block text-samsung-blue">
                       {slaPercentage}%
                     </span>
                   </div>
                 </div>
                 <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-100 shadow-inner">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${slaPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center samsung-gradient"
                   ></motion.div>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors"><Tag className="h-6 w-6 text-gray-400 group-hover:text-samsung-blue transition-colors" /></div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Priority</p>
                    <p className="font-extrabold text-lg text-gray-900">Level {caseData.priority}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors"><Clock className="h-6 w-6 text-gray-400 group-hover:text-samsung-blue transition-colors" /></div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Created</p>
                    <p className="font-extrabold text-gray-900">{new Date(caseData.sys_created_on).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="h-5 w-5 text-samsung-blue" />
                  <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">Description</p>
                </div>
                <div className="bg-gray-50/50 rounded-xl p-6 text-gray-700 text-sm whitespace-pre-wrap border border-gray-100 shadow-inner leading-relaxed">
                  {caseData.description || 'No detailed description provided.'}
                </div>
              </div>
            </div>

            {/* CSAT Survey for Resolved Cases */}
            {isClosed && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-10 pt-8 border-t border-gray-100"
              >
                <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                  <div className="text-center md:text-left">
                    <h4 className="text-lg font-bold text-emerald-900">How was your experience?</h4>
                    <p className="text-sm text-emerald-700">Your feedback helps us improve our enterprise support.</p>
                  </div>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={async () => {
                          setCsatRating(star);
                          if (caseData?.sys_id) {
                            await submitCsat(caseData.sys_id, star);
                          }
                        }}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all shadow-sm ${
                          csatRating >= star ? 'bg-yellow-400 text-white shadow-yellow-200' : 'bg-white text-gray-300 border border-emerald-100 hover:border-yellow-300'
                        }`}
                      >
                        ★
                      </motion.button>
                    ))}
                    <AnimatePresence>
                      {csatRating > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="ml-4 flex items-center text-emerald-600 font-bold"
                        >
                          <span>Thank you!</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrackCase;
