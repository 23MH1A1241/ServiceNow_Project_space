import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Bot, User, Lock, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/portal" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/portal');
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 font-outfit relative overflow-hidden selection:bg-blue-500/30">
      {/* Background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse-slow"></div>

      <Link to="/" className="flex items-center space-x-3 mb-16 relative z-10 hover:scale-105 transition-transform group">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 transition-all shadow-2xl">
          <Bot className="text-blue-400 h-7 w-7" />
        </div>
        <span className="text-3xl font-black tracking-tighter">CaseFlow</span>
      </Link>

      <div className="glass-panel w-full max-w-md p-12 relative z-10 shadow-2xl border border-white/5 backdrop-blur-3xl">
        <div className="mb-12">
          <div className="inline-flex items-center px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[9px] font-black tracking-[0.2em] uppercase mb-4">
              <Sparkles className="w-3 h-3 mr-2" />
              Secure Gateway
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-2">Login</h1>
          <p className="text-white/30 font-medium">Authenticate to enter the portal.</p>
        </div>

        {error && (
          <div className="mb-10 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-bold flex items-center animate-shake">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-ping"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-white/20" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-bold text-white placeholder-white/10 shadow-inner"
                placeholder="admin, agent1..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-white/20" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-bold text-white placeholder-white/10 shadow-inner"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 disabled:opacity-50 mt-6"
          >
            {loading ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : (
              <>
                <span>Secure Access</span>
                <ArrowRight className="h-6 w-6" />
              </>
            )}
          </button>
        </form>
        
        <p className="mt-10 text-center text-white/20 font-bold text-sm">
          New user?{' '}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
            Register Identity
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
