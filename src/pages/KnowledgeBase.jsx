import React, { useState, useEffect } from 'react';
import { Book, Search, FileText, ArrowUpRight } from 'lucide-react';
import { getKnowledgeArticles } from '../api/serviceNow';

const KnowledgeBase = () => {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKB = async () => {
      try {
        const data = await getKnowledgeArticles();
        setArticles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchKB();
  }, []);

  const filtered = articles.filter(a => 
    a.short_description.toLowerCase().includes(search.toLowerCase()) || 
    a.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in font-outfit">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md text-[8px] font-black text-blue-400 uppercase tracking-widest">
            Resources
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900">Knowledge Base</h1>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-6 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/30 transition-all font-bold text-sm shadow-sm"
            placeholder="Search articles..."
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article, idx) => (
            <div key={idx} className="glass-panel p-8 group hover:border-blue-500/30 transition-all cursor-pointer flex flex-col justify-between min-h-[250px] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[60px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div>
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                     <Book className="text-gray-400 group-hover:text-blue-500 w-6 h-6 transition-colors" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors tracking-tight leading-tight line-clamp-2">
                     {article.short_description}
                  </h3>
                  <p className="text-[12px] text-gray-400 font-medium line-clamp-2 leading-relaxed">
                     {article.text}
                  </p>
               </div>
               <div className="pt-6 flex items-center text-[9px] font-black text-blue-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View Details</span>
                  <ArrowUpRight className="w-3 h-3 ml-1" />
               </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-24 text-center glass-panel border-dashed">
              <FileText className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <p className="text-lg font-black text-gray-400 tracking-tight">No results found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
