import React, { useEffect, useState } from 'react';
import { Book, Search, FileText } from 'lucide-react';
import { getKnowledgeArticles } from '../api/serviceNow';

const KnowledgeBase = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    getKnowledgeArticles().then(setArticles);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-[#1428A0] mb-4">
          <Book className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Knowledge Base</h1>
        <p className="text-gray-500 mt-3 text-lg max-w-2xl mx-auto">Find answers to common issues, product guides, and troubleshooting steps.</p>
        
        <div className="max-w-2xl mx-auto mt-8 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full p-5 pl-12 bg-white border border-gray-200 text-gray-900 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#1428A0] focus:border-transparent text-lg transition-all"
            placeholder="Search for articles..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <div key={article.sys_id} className="glass-card flex items-start space-x-4 cursor-pointer group">
            <div className="p-3 bg-blue-50 rounded-xl text-[#1428A0] group-hover:scale-110 transition-transform">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#1428A0] transition-colors">{article.short_description}</h3>
              <p className="text-gray-500 text-sm line-clamp-2">{article.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeBase;
