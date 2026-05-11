import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Zap, Shield, ChevronRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-hidden relative font-outfit">
      {/* Falling Blue Balls Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-blue-500/20 rounded-full blur-xl animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * -100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              opacity: Math.random() * 0.5 + 0.1
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 samsung-gradient rounded-xl flex items-center justify-center shadow-lg">
            <Bot className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tighter">CaseFlow AI</span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 font-bold text-gray-600 hover:text-samsung-blue transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="px-6 py-2.5 samsung-gradient text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all shadow-blue-500/25"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-samsung-blue text-sm font-bold tracking-wide uppercase shadow-sm">
            <Zap className="w-4 h-4 mr-2 fill-current" />
            Next-Gen Enterprise Support
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[0.95] tracking-tight">
            Automate your <br />
            <span className="text-transparent bg-clip-text samsung-gradient">Service Workflow</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium max-w-lg leading-relaxed">
            CaseFlow AI leverages high-performance routing engines to categorize, assign, and escalate enterprise cases in real-time.
          </p>
          <div className="flex items-center space-x-6 pt-4">
            <button 
              onClick={() => navigate('/signup')}
              className="px-8 py-4 samsung-gradient text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center shadow-blue-500/30 text-lg"
            >
              Get Started Free <ChevronRight className="ml-2 w-5 h-5" />
            </button>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-white bg-blue-50 flex items-center justify-center text-samsung-blue text-xs font-bold shadow-sm">
                +2k
              </div>
            </div>
          </div>
        </div>

        <div className="relative animate-fade-in-right">
          <div className="absolute -inset-4 bg-samsung-blue opacity-10 blur-3xl rounded-[4rem]"></div>
          <div className="relative glass-panel p-4 border border-white shadow-2xl rounded-[2.5rem] overflow-hidden">
             <div className="bg-[#0A1450] rounded-[2rem] p-8 aspect-[4/3] flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex justify-between items-start">
                   <div className="space-y-1">
                      <p className="text-blue-300 text-xs font-bold uppercase tracking-widest">Active System Load</p>
                      <p className="text-4xl font-black text-white tracking-tighter">98.4%</p>
                   </div>
                   <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                      <Shield className="text-blue-400 w-6 h-6" />
                   </div>
                </div>
                <div className="relative z-10 flex items-end justify-between">
                   <div className="flex space-x-2">
                      {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                        <div key={i} className="w-2 bg-blue-400/30 rounded-full relative" style={{ height: '60px' }}>
                          <div className="absolute bottom-0 w-full bg-blue-400 rounded-full animate-grow-up" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}></div>
                        </div>
                      ))}
                   </div>
                   <div className="text-right">
                      <p className="text-blue-200 text-sm font-bold">Latency: 12ms</p>
                      <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Zurich Instance</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-8 relative z-10">
        {[
          { title: 'AI Categorization', desc: 'Auto-route cases using advanced keyword extraction.', icon: Bot, color: 'bg-blue-50 text-blue-600' },
          { title: 'SLA Monitoring', desc: 'Predictive analytics for service level compliance.', icon: Zap, color: 'bg-orange-50 text-orange-600' },
          { title: 'Role-Based Access', desc: 'Secure portals for Admin, Agent, and Customers.', icon: Shield, color: 'bg-emerald-50 text-emerald-600' }
        ].map((f, i) => (
          <div key={i} className="glass-panel p-8 group hover:border-samsung-blue/30 transition-all cursor-default">
            <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <f.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{f.title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(100vh) scale(1.2); }
          100% { transform: translateY(0) scale(1); }
        }
        .animate-float {
          animation: float infinite linear;
        }
        @keyframes grow-up {
          from { height: 0; }
          to { height: 100%; }
        }
        .animate-grow-up {
          animation: grow-up 1s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default Landing;
