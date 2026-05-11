import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Loader2, CheckCircle, Bot, Mail, Lock, User } from 'lucide-react';
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
      <div className="min-h-screen bg-[#F4F7F6] flex items-center justify-center p-6 font-outfit">
        <div className="glass-panel p-10 max-w-md w-full text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Account Created!</h1>
          <p className="text-gray-500 font-medium leading-relaxed">
            Your ServiceNow profile has been provisioned. Redirecting to login...
          </p>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-green-500 animate-[width_2s_ease-in-out]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col items-center justify-center p-6 font-outfit relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>

      <Link to="/" className="flex items-center space-x-3 mb-12 relative z-10 hover:scale-105 transition-transform">
        <div className="w-10 h-10 samsung-gradient rounded-xl flex items-center justify-center shadow-lg">
          <Bot className="text-white h-6 w-6" />
        </div>
        <span className="text-2xl font-black text-gray-900 tracking-tighter">CaseFlow AI</span>
      </Link>

      <div className="glass-panel w-full max-w-xl p-10 relative z-10 shadow-2xl border border-white">
        <div className="mb-10">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Join CaseFlow</h2>
          <p className="text-gray-500 font-medium">Create your enterprise support profile today.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold flex items-center shadow-sm">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  required
                  placeholder="John"
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-samsung-blue transition-all font-bold text-gray-900 shadow-inner"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                placeholder="Doe"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-samsung-blue transition-all font-bold text-gray-900 shadow-inner"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
            <div className="relative">
              <Bot className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="username"
                required
                placeholder="johndoe_enterprise"
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-samsung-blue transition-all font-bold text-gray-900 shadow-inner uppercase tracking-wider text-xs"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Corporate Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                placeholder="john.doe@enterprise.com"
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-samsung-blue transition-all font-bold text-gray-900 shadow-inner"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-samsung-blue transition-all font-bold text-gray-900 shadow-inner"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm</label>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-samsung-blue transition-all font-bold text-gray-900 shadow-inner"
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full samsung-gradient text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 disabled:opacity-70 mt-4"
          >
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <UserPlus className="h-6 w-6" />
                <span>Create Enterprise Account</span>
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 font-bold">
          Already have an account?{' '}
          <Link to="/login" className="text-samsung-blue hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
