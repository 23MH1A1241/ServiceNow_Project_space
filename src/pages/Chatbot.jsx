import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Laptop, Smartphone, Wifi, Server } from 'lucide-react';
import { createCase } from '../api/serviceNow';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I am the CaseFlow AI Assistant.' },
    { id: 2, type: 'bot', text: 'Please select the product category you need help with:', isSelection: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State machine for the conversation flow
  const [step, setStep] = useState(1); // 1: product, 2: short_description, 3: description, 4: urgency, 5: done
  const [caseData, setCaseData] = useState({
    category: '', // We will prepend this to short_description
    short_description: '',
    description: '',
    urgency: '3',
    priority: '3'
  });
  const [csatRating, setCsatRating] = useState(0);

  const extractIntent = (text) => {
    const t = text.toLowerCase();
    if (t.includes('create') || t.includes('new') || t.includes('problem')) return 'create_case';
    if (t.includes('status') || t.includes('track') || t.includes('where')) return 'track_case';
    if (t.includes('help') || t.includes('how')) return 'get_help';
    return 'unknown';
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), type: 'bot', text }]);
  };

  const handleProductSelect = (productName) => {
    setMessages(prev => prev.map(m => m.isSelection ? { ...m, isSelection: false } : m));
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: productName }]);
    setCaseData(prev => ({ ...prev, category: productName }));
    
    setLoading(true);
    setTimeout(() => {
      addBotMessage(`You selected ${productName}. Please briefly describe the issue you are experiencing.`);
      setStep(2);
      setLoading(false);
    }, 1000);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || step === 5 || step === 1) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: userMsg }]);
    setLoading(true);

    // Process step
    setTimeout(async () => {
      try {
        if (step === 2) {
          // Capture short description
          setCaseData(prev => ({ ...prev, short_description: userMsg }));
          addBotMessage('Thank you. Could you please provide more detailed information about this issue, including any error messages?');
          setStep(3);
          setLoading(false);
        } 
        else if (step === 3) {
          // Capture detailed description
          setCaseData(prev => ({ ...prev, description: userMsg }));
          addBotMessage('Got it. How urgent is this issue? Please reply with High, Medium, or Low.');
          setStep(4);
          setLoading(false);
        }
        else if (step === 4) {
          // Capture urgency and submit
          let urgencyVal = '3'; // Default Low
          const uStr = userMsg.toLowerCase();
          if (uStr.includes('high')) urgencyVal = '1';
          else if (uStr.includes('medium')) urgencyVal = '2';
          
          let priorityVal = '3';
          if (urgencyVal === '1') priorityVal = '2'; // High urgency gets higher priority

          const finalCaseData = {
            ...caseData,
            short_description: `[${caseData.category}] ${caseData.short_description}`,
            urgency: urgencyVal,
            priority: priorityVal
          };

          addBotMessage('Thank you. I am creating a case for you now. Please hold on...');
          
          try {
            const newCase = await createCase(finalCaseData);
            addBotMessage(`Success! Your case has been logged and assigned. The Case Number is: **${newCase.number}**.`);
            addBotMessage('Our support team will review it shortly. How would you rate your experience with me today?');
            setStep(5); // Flow complete
          } catch (apiError) {
            console.error('Case creation failed via chatbot:', apiError);
            addBotMessage('I apologize, but I encountered an error while communicating with the ServiceNow backend. Please try using the standard "Create Case" form instead.');
            setStep(5);
          }
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        addBotMessage('An unexpected error occurred. Let\'s start over. What issue are you experiencing?');
        setStep(2);
      }
    }, 1000); // Artificial delay to simulate "typing"
  };

  const products = [
    { name: 'Enterprise Laptop', icon: Laptop, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Mobile Device', icon: Smartphone, color: 'text-green-500', bg: 'bg-green-50' },
    { name: 'Network Router', icon: Wifi, color: 'text-purple-500', bg: 'bg-purple-50' },
    { name: 'Server / Infrastructure', icon: Server, color: 'text-orange-500', bg: 'bg-orange-50' }
  ];

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Virtual Agent</h1>
        <p className="text-gray-500 mt-2 text-lg">Report An Issue flow powered by AI routing.</p>
      </div>

      <div className="flex-1 glass-panel flex flex-col overflow-hidden relative shadow-xl shadow-blue-900/5 border border-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-samsung-blue opacity-[0.02] rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Chat Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white/50 z-10">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full samsung-gradient flex items-center justify-center shadow-md">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h2 className="font-bold text-gray-900">CaseFlow AI</h2>
              <p className="text-xs font-semibold text-green-600">Online</p>
            </div>
          </div>
          {step === 5 && (
            <button 
              onClick={() => {
                setMessages([
                  { id: 1, type: 'bot', text: 'Let\'s start a new request.' },
                  { id: 2, type: 'bot', text: 'Please select the product category you need help with:', isSelection: true }
                ]);
                setStep(1);
                setCaseData({ category: '', short_description: '', description: '', urgency: '3', priority: '3' });
              }}
              className="text-sm font-bold text-samsung-blue hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              Restart Flow
            </button>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10">
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col">
              <div className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                <div className={`flex items-end space-x-2 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.type === 'user' ? 'bg-gray-200' : 'samsung-gradient'}`}>
                    {msg.type === 'user' ? <User className="h-4 w-4 text-gray-600" /> : <Bot className="h-4 w-4 text-white" />}
                  </div>
                  <div className={`px-5 py-3 rounded-2xl shadow-sm ${
                    msg.type === 'user' 
                      ? 'bg-samsung-blue text-white rounded-br-sm' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                  }`}>
                    {msg.text.includes('**') ? (
                      <p className="text-sm font-medium leading-relaxed">
                        {msg.text.split('**')[0]}
                        <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded mx-1 border border-blue-100">{msg.text.split('**')[1]}</span>
                        {msg.text.split('**')[2]}
                      </p>
                    ) : (
                      <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Render Product Selection Cards if this is the selection message */}
              {msg.isSelection && (
                <div className="ml-10 grid grid-cols-2 gap-3 mt-2 max-w-lg">
                  {products.map((prod, idx) => {
                    const Icon = prod.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleProductSelect(prod.name)}
                        className="bg-white border border-gray-200 rounded-xl p-4 hover:border-samsung-blue hover:shadow-md transition-all flex flex-col items-center text-center group"
                      >
                        <div className={`w-12 h-12 rounded-full ${prod.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-6 h-6 ${prod.color}`} />
                        </div>
                        <span className="text-sm font-bold text-gray-800">{prod.name}</span>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* CSAT Rating Widget */}
              {step === 5 && msg.text.includes('rate your experience') && (
                <div className="ml-10 flex space-x-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setCsatRating(star)}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                        csatRating >= star ? 'bg-yellow-400 border-yellow-500 text-white' : 'bg-white border-gray-200 text-gray-400'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  {csatRating > 0 && <span className="text-sm font-bold text-green-600 flex items-center">Thank you!</span>}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-end space-x-2">
                <div className="w-8 h-8 rounded-full samsung-gradient flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="px-5 py-4 bg-white border border-gray-100 rounded-2xl rounded-bl-sm flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white/80 border-t border-gray-100 z-10">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={step === 5 || step === 1 || loading}
              placeholder={
                step === 5 ? "Flow complete. Click Restart above." : 
                step === 1 ? "Please select a product above..." : 
                "Type your response..."
              }
              className="w-full py-4 pl-6 pr-16 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-samsung-blue/30 focus:border-samsung-blue transition-all font-medium text-gray-800 shadow-inner disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={loading || !input.trim() || step === 5 || step === 1}
              className="absolute right-2 w-12 h-12 flex items-center justify-center rounded-full samsung-gradient text-white shadow-md disabled:opacity-50 hover:scale-105 transition-transform"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ml-1" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
