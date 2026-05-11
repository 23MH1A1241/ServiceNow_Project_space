import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Hexagon, User, Lock, Loader2, ArrowRight } from 'lucide-react';
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
      setError(err.message || 'Authentication failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-samsung-light flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-samsung-blue rounded-full opacity-5 blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#0A1450] rounded-full opacity-5 blur-[120px]"></div>

      <div className="glass-panel w-full max-w-md p-10 z-10 animate-slide-up">
        <div className="text-center mb-10">
          <div className="mx-auto samsung-gradient w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-900/20">
            <Hexagon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">CaseFlow AI</h1>
          <p className="text-gray-500 mt-2 font-medium">ServiceNow Enterprise Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl font-medium shadow-sm animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="label-text">ServiceNow Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field pl-12"
                placeholder="admin, vinay, agent1..."
              />
            </div>
          </div>

          <div>
            <label className="label-text">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-12"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 mt-8"
          >
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <span className="text-lg">Secure Login</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 font-medium">Powered by ServiceNow Zurich</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
