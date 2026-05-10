import React, { useState, useEffect } from 'react';
import { Book, Search, FileText, ChevronRight } from 'lucide-react';
import { getKnowledgeArticles } from '../api/serviceNow';

const KnowledgeBase = () => {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKB = async () => {
      const data = await getKnowledgeArticles();
      setArticles(data);
      setLoading(false);
    };
    fetchKB();
  }, []);

  const filtered = articles.filter(a => 
    a.short_description.toLowerCase().includes(search.toLowerCase()) || 
    a.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Knowledge Base</h1>
          <p className="text-gray-500 mt-2 text-lg">Search solution articles and FAQs.</p>
        </div>
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-12 rounded-full"
            placeholder="Search articles..."
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-samsung-blue"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((article, idx) => (
            <div key={idx} className="glass-card group cursor-pointer flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start space-x-4 mb-4">
                  <div className="p-3 bg-blue-50 text-samsung-blue rounded-xl flex-shrink-0 group-hover:samsung-gradient group-hover:text-white transition-colors">
                    <Book className="h-6 w-6" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-samsung-blue transition-colors line-clamp-2">
                    {article.short_description}
                  </h2>
                </div>
                <p className="text-sm text-gray-600 font-medium line-clamp-3 mb-6">
                  {article.text}
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest mt-auto border-t border-gray-100 pt-4 group-hover:text-samsung-blue transition-colors">
                <span>Read Article</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full p-12 text-center bg-gray-50 border border-gray-200 rounded-2xl border-dashed">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-lg font-bold text-gray-500">No articles found matching "{search}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
