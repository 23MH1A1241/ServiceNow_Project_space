import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Loader2, CheckCircle, Bot, Mail, Lock, User, Sparkles } from 'lucide-react';
import { createUser } from '../api/serviceNow';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await createUser(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 font-outfit">
        <div className="glass-panel p-10 max-w-md w-full text-center space-y-8 border-white/5 backdrop-blur-3xl shadow-[0_0_50px_rgba(37,99,235,0.2)]">
          <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
             <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
             <CheckCircle className="h-12 w-12 text-blue-400 relative z-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight">Success</h1>
            <p className="text-white/40 font-medium">Provisioning your enterprise identity...</p>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 animate-[loading_2s_ease-in-out]"></div>
          </div>
        </div>
        <style>{`@keyframes loading { from { width: 0; } to { width: 100%; } }`}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 font-outfit relative overflow-hidden selection:bg-blue-500/30">
      {/* Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse-slow"></div>

      <Link to="/" className="flex items-center space-x-3 mb-16 relative z-10 hover:scale-105 transition-transform group">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 transition-all shadow-2xl">
          <Bot className="text-blue-400 h-7 w-7" />
        </div>
        <span className="text-3xl font-black tracking-tighter">CaseFlow</span>
      </Link>

      <div className="glass-panel w-full max-w-xl p-12 relative z-10 shadow-2xl border border-white/5 backdrop-blur-3xl">
        <div className="mb-12">
           <div className="inline-flex items-center px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[9px] font-black tracking-[0.2em] uppercase mb-4">
              <Sparkles className="w-3 h-3 mr-2" />
              Onboarding
           </div>
           <h2 className="text-5xl font-black tracking-tighter mb-2">Create Identity</h2>
           <p className="text-white/30 font-medium">Secure your spot in the automated enterprise.</p>
        </div>

        {error && (
          <div className="mb-10 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-bold flex items-center animate-shake">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-ping"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">First Name</label>
              <input
                type="text"
                name="firstName"
                required
                placeholder="John"
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-bold text-white placeholder-white/10 shadow-inner"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                placeholder="Doe"
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-bold text-white placeholder-white/10 shadow-inner"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Enterprise Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20" />
              <input
                type="text"
                name="username"
                required
                placeholder="jdoe_admin"
                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-bold text-white placeholder-white/10 shadow-inner uppercase tracking-wider text-xs"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Corporate Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20" />
              <input
                type="email"
                name="email"
                required
                placeholder="john.doe@enterprise.com"
                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-bold text-white placeholder-white/10 shadow-inner"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-bold text-white placeholder-white/10 shadow-inner"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Verify</label>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-bold text-white placeholder-white/10 shadow-inner"
                onChange={handleChange}
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
              <span>Create Account</span>
            )}
          </button>
        </form>

        <p className="mt-10 text-center text-white/20 font-bold text-sm">
          Already verified?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
