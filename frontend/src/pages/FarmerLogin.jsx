import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, AlertCircle, ArrowRight, ShieldCheck, Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function FarmerLogin() {
  const { t } = useLanguage();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const loggedUser = await login(identifier, password);
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-click Demo Accounts for easy CSP demonstration
  const handleDemoLogin = (role) => {
    if (role === 'farmer') {
      setIdentifier('9988776655');
      setPassword('Farmer@123');
    } else if (role === 'admin') {
      setIdentifier('admin@rythusahayam.ap.gov.in');
      setPassword('Admin@12345');
    }
  };

  return (
    <div className="bg-[#fbfaf5] min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#e2e7e7] p-7 sm:p-9 shadow-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#e3f1e7] text-2xl text-[#07503c] mb-2">
            🌱
          </div>
          <h1 className="text-2xl font-extrabold text-[#06483d]">
            {t('login.title')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {t('login.subtitle')}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {t('login.identifierLabel')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={t('login.identifierPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm bg-white border border-[#dce2e2] rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {t('login.passwordLabel')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('login.passwordPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm bg-white border border-[#dce2e2] rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#07503c] hover:bg-[#06483d] text-white font-bold rounded-xl text-sm shadow transition disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{loading ? t('login.authenticating') : t('login.signInBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Login Shortcuts */}
        <div className="bg-[#f8faf8] p-3.5 rounded-xl border border-gray-200 text-xs space-y-2">
          <p className="font-bold text-gray-700 text-center">
            {t('login.quickDemo')}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('farmer')}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-emerald-50 text-[#07503c] font-bold rounded border border-gray-200 text-[11px] shadow-sm transition"
            >
              {t('login.demoFarmer')}
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-amber-50 text-amber-900 font-bold rounded border border-gray-200 text-[11px] shadow-sm transition"
            >
              {t('login.demoAdmin')}
            </button>
          </div>
        </div>

        {/* Registration Link */}
        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-600">
          <span>{t('login.newFarmer')} </span>
          <Link to="/register" className="font-bold text-[#07503c] hover:underline">
            {t('login.registerHere')}
          </Link>
        </div>
      </div>
    </div>
  );
}
