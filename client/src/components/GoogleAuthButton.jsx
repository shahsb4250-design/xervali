import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Settings, ExternalLink, X, ShieldCheck, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

export default function GoogleAuthButton({ onSuccess, onError, mode = 'signin' }) {
  const [customClientId, setCustomClientId] = useState(() => {
    return localStorage.getItem('xervali_google_client_id') || '';
  });
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [configSuccessMsg, setConfigSuccessMsg] = useState('');

  // Active client ID from environment variable or user-provided storage
  const activeClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || customClientId;

  const handleSaveClientId = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const cleanId = inputVal.trim();
    localStorage.setItem('xervali_google_client_id', cleanId);
    setCustomClientId(cleanId);
    setConfigSuccessMsg('Google Client ID applied successfully!');
    setTimeout(() => {
      setConfigSuccessMsg('');
      setShowConfigModal(false);
    }, 1500);
  };

  const handleClearClientId = () => {
    localStorage.removeItem('xervali_google_client_id');
    setCustomClientId('');
    setInputVal('');
  };

  return (
    <div className="w-full space-y-2">
      {activeClientId ? (
        <div className="w-full">
          <GoogleOAuthProvider clientId={activeClientId}>
            <div className="flex justify-center w-full min-h-[44px]">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse?.credential) {
                    onSuccess(credentialResponse.credential);
                  } else {
                    onError?.('No credential returned from Google');
                  }
                }}
                onError={() => {
                  onError?.('Google Sign-In was cancelled or failed. Please try again.');
                }}
                theme="outline"
                size="large"
                text={mode === 'signup' ? 'signup_with' : 'signin_with'}
                shape="rectangular"
                width="100%"
              />
            </div>
          </GoogleOAuthProvider>
          
          <div className="flex items-center justify-between pt-1.5 px-1 text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck size={12} /> Google Identity Services Active
            </span>
            <button
              type="button"
              onClick={() => {
                setInputVal(activeClientId);
                setShowConfigModal(true);
              }}
              className="hover:text-slate-600 hover:underline flex items-center gap-1"
            >
              <Settings size={10} /> Config
            </button>
          </div>
        </div>
      ) : (
        /* When Client ID is not yet configured, show official button that guides setup */
        <div>
          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 rounded-xl text-xs font-bold transition flex items-center justify-center gap-3 shadow-sm group"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="group-hover:text-slate-900">
              {mode === 'signup' ? 'Sign Up with Real Google Account' : 'Sign In with Real Google Account'}
            </span>
          </button>
          <p className="text-[10px] text-center text-slate-400 mt-1">
            Official Google OAuth2 cryptographic authentication
          </p>
        </div>
      )}

      {/* Google Cloud OAuth Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <KeyRound size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Real Google OAuth Configuration</h3>
                  <p className="text-[11px] text-slate-500">Connect to your official Google Cloud project credentials</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {configSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{configSuccessMsg}</span>
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-600">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-amber-600" /> How to connect real Google Auth:
                </p>
                <ol className="list-decimal pl-4 space-y-1.5 text-[11px] leading-relaxed">
                  <li>
                    Go to{' '}
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-700 font-bold hover:underline inline-flex items-center gap-0.5"
                    >
                      Google Cloud Console <ExternalLink size={10} />
                    </a>
                  </li>
                  <li>Create an <strong>OAuth 2.0 Client ID</strong> (Web application).</li>
                  <li>
                    Add Authorized JavaScript origin: <code className="bg-white px-1.5 py-0.5 rounded border text-slate-800">http://localhost:3000</code>
                  </li>
                  <li>Copy your Client ID (ends with <code className="text-slate-700">.apps.googleusercontent.com</code>) and paste it below or add <code className="text-slate-700">VITE_GOOGLE_CLIENT_ID</code> in <code className="text-slate-700">.env</code>.</li>
                </ol>
              </div>

              <form onSubmit={handleSaveClientId} className="space-y-3">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Google Client ID
                </label>
                <input
                  type="text"
                  required
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="e.g. 1234567890-abcdefg.apps.googleusercontent.com"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900 bg-white"
                />

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-slate-900 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    Save & Activate Real Google Sign-In
                  </button>
                  {customClientId && (
                    <button
                      type="button"
                      onClick={handleClearClientId}
                      className="px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold hover:bg-rose-100 transition"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
