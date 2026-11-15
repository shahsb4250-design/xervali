import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Shield, User, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from '../components/GoogleAuthButton';

export default function LoginPage({ navigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login, loginWithGoogle, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = await login(email, password);
    if (res.success) {
      if (res.user.role === 'admin' || res.user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/shop');
      }
    } else {
      setErrorMsg(res.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleGoogleSuccess = async (credential) => {
    setErrorMsg('');
    const res = await loginWithGoogle(credential);
    if (res.success) {
      if (res.user.role === 'admin' || res.user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/shop');
      }
    } else {
      setErrorMsg(res.message || 'Google authentication failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">CLIENT AUTHENTICATION</span>
        <h1 className="font-serif text-3xl font-bold text-slate-900">Sign In to Your Account</h1>
        <p className="text-xs text-slate-500 font-light">Access your exclusive order tracking, saved wishlist, and concierge services.</p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Primary Authentication Container */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-5">
        
        {/* REAL GOOGLE SIGN IN BUTTON */}
        <GoogleAuthButton
          onSuccess={handleGoogleSuccess}
          onError={(err) => setErrorMsg(err)}
          mode="signin"
        />

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">or sign in with password</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. syedismail12570@gmail.com"
                className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900 bg-slate-50/50" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Encrypted Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900 bg-slate-50/50" 
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-slate-950 hover:bg-amber-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In with Password'} <ArrowRight size={14} />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          New to XERVALI?{' '}
          <button 
            type="button" 
            onClick={() => navigate('/register')} 
            className="text-amber-600 font-bold hover:underline"
          >
            Create an Account
          </button>
        </div>
      </div>

      {/* Security Assurance Badge */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
        <ShieldCheck size={14} className="text-emerald-600" />
        <span>Bcrypt Hashing with Salt · Brute-Force Rate Limiting Active</span>
      </div>
    </div>
  );
}
