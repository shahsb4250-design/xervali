import React, { useState } from 'react';
import { Lock, ArrowRight, AlertCircle, ShieldAlert, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from '../components/GoogleAuthButton';

export default function AdminLoginPage({ navigate }) {
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
        setErrorMsg('Access Denied: This account does not have store owner / admin privileges.');
      }
    } else {
      setErrorMsg(res.message || 'Authentication failed. Check your admin credentials.');
    }
  };

  const handleGoogleSuccess = async (credential) => {
    setErrorMsg('');
    const res = await loginWithGoogle(credential);
    if (res.success) {
      if (res.user.role === 'admin' || res.user.isAdmin) {
        navigate('/admin');
      } else {
        setErrorMsg('Access Denied: Only syedismail12570@gmail.com has owner privileges.');
      }
    } else {
      setErrorMsg(res.message || 'Google authentication failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-slate-950 text-white selection:bg-amber-600">
      <div className="max-w-md w-full space-y-8">
        
        {/* Security Shield Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 mb-2">
            <KeyRound size={28} />
          </div>
          <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest block">RESTRICTED ACCESS PORTAL</span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white">XERVALI Staff Portal</h1>
          <p className="text-xs text-slate-400 font-light max-w-xs mx-auto">
            Authorized management console for store administration, inventory, and order fulfillment.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle size={18} className="flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-slate-900/90 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 backdrop-blur-md">
          
          {/* Real Google Admin Auth */}
          <div className="space-y-2">
            <GoogleAuthButton
              onSuccess={handleGoogleSuccess}
              onError={(err) => setErrorMsg(err)}
              mode="signin"
            />
            <p className="text-[10px] text-center text-slate-500">
              Only authorized owner account (<span className="text-amber-400">syedismail12570@gmail.com</span>) is granted entry
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800"></div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">or admin credentials</span>
            <div className="flex-1 h-px bg-slate-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="syedismail12570@gmail.com"
                className="w-full text-xs px-4 py-3.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition" 
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Master Security Key / Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs pl-10 pr-4 py-3.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition" 
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-widest transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Verifying Credentials...' : 'Authenticate Admin'} <ArrowRight size={14} />
            </button>
          </form>

          <div className="pt-2 text-center">
            <button 
              type="button" 
              onClick={() => navigate('/')} 
              className="text-xs text-slate-500 hover:text-slate-300 transition"
            >
              ← Return to Customer Storefront
            </button>
          </div>
        </div>

        {/* Confidential Notice */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-600">
          <ShieldAlert size={14} />
          <span>Restricted Area · Unauthorized Access Attempts Are Monitored</span>
        </div>
      </div>
    </div>
  );
}
