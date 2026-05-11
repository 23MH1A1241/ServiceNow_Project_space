import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, MessageSquare, Loader2, Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { processChatIntent, createCase } from '../api/serviceNow';
import { getAIResolution } from '../api/gemini';

const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'bot', content: `Identity verified. Systems nominal. How can I assist you today, ${user?.name}?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCreatingCase, setIsCreatingCase] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      // First, process intent via ServiceNow (simulated)
      const intentResponse = await processChatIntent(userMessage, user);
      
      // Then, get an actual AI resolution from Gemini
      const aiResolution = await getAIResolution(userMessage, user?.role, { intent: intentResponse.data?.intent });
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: aiResolution, 
        data: intentResponse.data,
        canEscalate: true
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: "Interface error. Connection to Neural Engine lost." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRaiseCase = async (query) => {
    setIsCreatingCase(true);
    try {
      const newCase = await createCase({
        short_description: `Escalated from AI Chat: ${query.slice(0, 50)}...`,
        description: `User reported that the AI resolution for "${query}" did not work. Escalate to human agent.`,
        priority: '2',
        caller_id: user?.sys_id
      });
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: `Neural escalation complete. Case ${newCase.number} has been provisioned. A human agent will review your query shortly.`,
        data: { case_number: newCase.number }
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: "Escalation failed. Please use the manual 'Create Case' page." }]);
    } finally {
      setIsCreatingCase(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-180px)] flex flex-col font-outfit animate-fade-in">
      <div className="flex justify-between items-end mb-8">
        <div className="space-y-1">
          <div className="inline-flex items-center px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md text-[8px] font-black text-blue-400 uppercase tracking-widest">
            Neural Interface
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900">AI Assistant</h1>
        </div>
      </div>

      <div className="flex-1 glass-panel border-white/5 bg-white shadow-2xl relative overflow-hidden flex flex-col">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-bl-full blur-3xl pointer-events-none"></div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
              <div className={`flex items-start space-x-4 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                  m.role === 'bot' ? 'bg-[#020617] text-blue-400' : 'bg-blue-600 text-white'
                }`}>
                  {m.role === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className={`space-y-3`}>
                   <div className={`p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${
                     m.role === 'bot' 
                      ? 'bg-gray-50 text-gray-900 rounded-tl-none border border-gray-100' 
                      : 'bg-blue-600 text-white rounded-tr-none shadow-blue-500/20'
                   }`}>
                     {m.content}
                   </div>
                   {m.canEscalate && !isCreatingCase && (
                      <div className="flex items-center space-x-3 mt-4 animate-fade-in">
                         <button 
                           onClick={() => handleRaiseCase(messages[i-1]?.content || m.content)}
                           className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center space-x-2"
                         >
                            <AlertCircle className="w-3 h-3" />
                            <span>This didn't work. Raise Case.</span>
                         </button>
                      </div>
                   )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-[#020617] rounded-2xl flex items-center justify-center text-blue-400 shadow-lg">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="p-5 bg-gray-50 rounded-[2rem] rounded-tl-none border border-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="p-6 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="w-full pl-6 pr-16 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/30 transition-all font-bold text-gray-900 shadow-inner"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#020617] text-blue-400 rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="mt-4 flex items-center justify-center space-x-2 text-[8px] font-black text-gray-300 uppercase tracking-widest">
             <Sparkles className="w-3 h-3" />
             <span>Neural Engine v2.4 Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
