import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Zap, Shield, ArrowRight, Sparkles, Activity, Layers } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative font-outfit selection:bg-blue-500/30">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse-slow"></div>
        
        {/* Falling Glowing Orbs */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-float-glow"
            style={{
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * -20}%`,
              background: `radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.8), rgba(30, 58, 138, 0.4))`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              opacity: Math.random() * 0.6 + 0.2
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-20 max-w-7xl mx-auto px-8 py-10 flex justify-between items-center">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 transition-all duration-500 shadow-2xl">
            <Bot className="text-blue-400 h-7 w-7 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            CaseFlow
          </span>
        </div>
        <div className="flex items-center space-x-8">
          <button 
            onClick={() => navigate('/login')}
            className="text-sm font-bold text-white/60 hover:text-white transition-colors tracking-widest uppercase"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="px-8 py-3 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            JOIN NOW
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-40 text-center">
        <div className="inline-flex items-center px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black tracking-[0.2em] uppercase mb-10 animate-fade-in">
          <Sparkles className="w-3 h-3 mr-2" />
          AI-Powered Automation
        </div>
        
        <h1 className="text-7xl md:text-[9rem] font-black leading-[0.85] tracking-tighter mb-12 animate-slide-up-glow">
          THINK <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-700">FASTER.</span>
        </h1>

        <div className="flex flex-col items-center space-y-12 animate-fade-in-delayed">
          <p className="text-lg text-white/40 font-medium max-w-md leading-relaxed">
            Eliminate manual routing. Let AI handle your enterprise service workflow with zero latency.
          </p>

          <div className="flex items-center space-x-6">
            <button 
              onClick={() => navigate('/signup')}
              className="px-12 py-5 bg-blue-600 text-white font-black rounded-[2rem] shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all text-xl flex items-center group"
            >
              Get Started <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        {/* Floating Abstract UI Elements */}
        <div className="mt-32 relative h-64 w-full hidden md:block">
           <div className="absolute left-[10%] top-0 p-6 glass-panel border-white/5 rounded-3xl animate-float shadow-2xl backdrop-blur-3xl w-64 text-left">
              <Activity className="text-blue-400 mb-4 h-8 w-8" />
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
              <p className="text-xl font-black">99.9% Up</p>
           </div>
           <div className="absolute right-[15%] top-10 p-6 glass-panel border-white/5 rounded-3xl animate-float-delayed shadow-2xl backdrop-blur-3xl w-64 text-left">
              <Layers className="text-purple-400 mb-4 h-8 w-8" />
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Queue</p>
              <p className="text-xl font-black">Automated</p>
           </div>
           <div className="absolute left-[40%] bottom-0 p-6 glass-panel border-white/5 rounded-3xl animate-float-slow shadow-2xl backdrop-blur-3xl w-72 text-left">
              <div className="flex items-center space-x-3 mb-4">
                 <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                 <p className="text-xs font-bold">New Case Routed</p>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500 w-3/4 animate-pulse"></div>
              </div>
           </div>
        </div>
      </main>

      {/* Visual Feature Grid - Minimalist */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 pb-40 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'ROUTING', icon: Bot },
          { label: 'SLA', icon: Zap },
          { label: 'SECURITY', icon: Shield },
          { label: 'METRICS', icon: Activity }
        ].map((f, i) => (
          <div key={i} className="glass-panel py-10 flex flex-col items-center justify-center border-white/5 hover:bg-white/5 transition-all cursor-pointer group">
             <f.icon className="w-8 h-8 text-blue-500/50 group-hover:text-blue-400 group-hover:scale-125 transition-all duration-500" />
             <span className="mt-4 text-[10px] font-black tracking-[0.3em] text-white/30 group-hover:text-white transition-colors">{f.label}</span>
          </div>
        ))}
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-glow {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(110vh) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }
        .animate-float-glow {
          animation: float-glow infinite linear;
        }
        @keyframes slide-up-glow {
          from { transform: translateY(50px); opacity: 0; filter: blur(20px); }
          to { transform: translateY(0); opacity: 1; filter: blur(0); }
        }
        .animate-slide-up-glow {
          animation: slide-up-glow 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-fade-in-delayed {
          animation: fade-in 1s ease-out 0.5s forwards;
          opacity: 0;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 8s ease-in-out infinite 1s;
        }
        .animate-float-slow {
          animation: float 10s ease-in-out infinite 2s;
        }
        .pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}} />
    </div>
  );
};

export default Landing;
