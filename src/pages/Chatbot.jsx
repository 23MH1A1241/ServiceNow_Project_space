import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { createCase } from '../api/serviceNow';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm the CaseFlow AI Virtual Agent. I can help you report an issue or create a case. Would you like to 'Report An Issue'?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // State machine for conversation flow
  const [flowState, setFlowState] = useState(0); // 0: Start, 1: Short Desc, 2: Category, 3: Detailed Desc
  const [caseData, setCaseData] = useState({
    short_description: '',
    category: 'inquiry',
    description: '',
    priority: '3'
  });

  const addBotMessage = (text, delay = 800) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now(), text, isBot: true }]);
      setIsTyping(false);
    }, delay);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { id: Date.now(), text: userText, isBot: false }]);
    setInput('');

    // Flow Logic
    if (flowState === 0) {
      if (userText.toLowerCase().includes('yes') || userText.toLowerCase().includes('report')) {
        addBotMessage("Great. I can help with that. Please provide a brief title or short description of your issue.");
        setFlowState(1);
      } else {
        addBotMessage("I am currently specialized in the 'Report An Issue' flow. Just type 'yes' to begin!");
      }
    } 
    else if (flowState === 1) {
      setCaseData(prev => ({ ...prev, short_description: userText }));
      addBotMessage("Got it. What category does this fall under? (e.g., Hardware, Software, Network, Billing, General Inquiry)");
      setFlowState(2);
    } 
    else if (flowState === 2) {
      let cat = 'inquiry';
      const lowered = userText.toLowerCase();
      if (lowered.includes('hard')) cat = 'hardware';
      else if (lowered.includes('soft')) cat = 'software';
      else if (lowered.includes('net')) cat = 'network';
      else if (lowered.includes('bill')) cat = 'billing';
      
      setCaseData(prev => ({ ...prev, category: cat }));
      addBotMessage("Thank you. Please provide a detailed description of the issue so our agents can investigate.");
      setFlowState(3);
    } 
    else if (flowState === 3) {
      const finalData = { ...caseData, description: userText };
      setCaseData(finalData);
      setFlowState(4);
      
      addBotMessage("Processing your request and creating a case in ServiceNow...", 500);
      
      try {
        // Actually call the ServiceNow API!
        const result = await createCase(finalData);
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            id: Date.now(), 
            text: `Success! Your case has been created. Your reference number is ${result.number}. You can track it in the 'Track Case' page.`, 
            isBot: true 
          }]);
          setIsTyping(false);
          setFlowState(0); // Reset flow
        }, 1500);
      } catch (error) {
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            id: Date.now(), 
            text: `I'm sorry, I encountered an error while communicating with ServiceNow: ${error.message}. Please try again later.`, 
            isBot: true 
          }]);
          setIsTyping(false);
          setFlowState(0);
        }, 1500);
      }
    }
  };

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col glass-panel overflow-hidden animate-in fade-in duration-500">
      <div className="samsung-gradient p-6 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center">
              Virtual Agent
              <Sparkles className="h-4 w-4 ml-2 text-yellow-300" />
            </h2>
            <p className="text-blue-100 text-sm font-medium">Topic: Report An Issue (Create Case Via Chat)</p>
          </div>
        </div>
        <button 
          onClick={() => { setMessages([{ id: 1, text: "Flow reset. Let's start over! Would you like to 'Report An Issue'?", isBot: true }]); setFlowState(0); }}
          className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
        >
          Reset Flow
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F4F7F6]/50 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex items-end space-x-2 max-w-[80%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.isBot ? 'bg-blue-100 text-[#1428A0]' : 'bg-gray-200 text-gray-600'}`}>
                {msg.isBot ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm font-medium shadow-sm ${
                msg.isBot 
                  ? 'bg-white border border-gray-100 text-gray-800 rounded-bl-none' 
                  : 'samsung-gradient text-white rounded-br-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1428A0] flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-gray-100 rounded-bl-none">
                <Loader2 className="w-5 h-5 animate-spin text-[#1428A0]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping || flowState === 4}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-[#1428A0] focus:border-[#1428A0] block pl-6 pr-14 py-4 transition-all disabled:opacity-50"
            placeholder="Type your message here..."
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping || flowState === 4}
            className="absolute right-2 p-2 bg-[#1428A0] text-white rounded-full hover:bg-blue-800 disabled:opacity-50 transition-colors shadow-md"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
