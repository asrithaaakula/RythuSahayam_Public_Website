import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { MapPin, Sprout, User, Menu, X, LogOut, LayoutDashboard, Shield, ChevronDown, Globe, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const langRef = useRef(null);
  const { user, logout, isAdmin } = useAuth();
  const { language, setLang, t, isTelugu } = useLanguage();
  const navigate = useNavigate();

  // Close language dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: t('navbar.home'), path: '/' },
    { name: t('navbar.cropGuidance'), path: '/crop-guidance' },
    { name: t('navbar.irrigation'), path: '/irrigation' },
    { name: t('navbar.schemes'), path: '/schemes' },
    { name: t('navbar.marketPrices'), path: '/market-prices' },
    { name: t('navbar.reportProblem'), path: '/report-problem' },
    { name: t('navbar.about'), path: '/about' }
  ];

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* Top Information Bar */}
      <div className="bg-[#073e32] text-white px-4 md:px-[6%] py-2 text-xs md:text-[13px] flex justify-between items-center flex-wrap gap-2 transition-all">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-emerald-300" />
          <span className="font-medium tracking-wide">{t('common.topLocation')}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-emerald-300" />
            <span className="text-emerald-50 font-medium">{t('common.topTagline')}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-white border-b border-gray-100 px-4 md:px-[6%] py-3.5 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-[#07503c] tracking-tight hover:opacity-90 transition shrink-0">
          <span className="text-2xl">🌿</span>
          <span className="font-extrabold text-[#07503c]">RythuSahayam</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-2.5 xl:px-3 py-1.5 text-[14px] font-semibold transition-colors duration-150 rounded-md whitespace-nowrap ${
                  isActive
                    ? 'text-[#07503c] bg-[#e3f1e7] font-bold'
                    : 'text-[#193d39] hover:text-[#07503c] hover:bg-[#f6f9f7]'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `px-3 py-1.5 text-[14px] font-semibold flex items-center gap-1 rounded-md ${
                  isActive
                    ? 'text-amber-800 bg-amber-100 font-bold'
                    : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50'
                }`
              }
            >
              <Shield className="w-3.5 h-3.5" />
              {t('navbar.admin')}
            </NavLink>
          )}
        </div>

        {/* Right side Language Switcher & Auth action */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {/* Global Language Selector Dropdown [ 🌐 English ▼ ] */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 bg-[#f0f5f2] hover:bg-[#e1ece5] text-[#07503c] px-3.5 py-2 rounded-lg text-xs font-bold border border-[#d2e2d8] transition shadow-xs cursor-pointer"
              aria-label="Language selector"
            >
              <Globe className="w-4 h-4 text-emerald-700" />
              <span className="font-bold">{language === 'te' ? 'తెలుగు' : 'English'}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-emerald-800 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn">
                <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Select Language / భాష
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLang('en');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-left transition ${
                    language === 'en' ? 'bg-[#e3f1e7] text-[#07503c] font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">🇬🇧</span> English
                  </span>
                  {language === 'en' && <Check className="w-4 h-4 text-[#07503c]" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLang('te');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-left transition ${
                    language === 'te' ? 'bg-[#e3f1e7] text-[#07503c] font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">🇮🇳</span> తెలుగు (Telugu)
                  </span>
                  {language === 'te' && <Check className="w-4 h-4 text-[#07503c]" />}
                </button>
              </div>
            )}
          </div>

          {/* User Profile or Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 bg-[#07503c] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#06483d] shadow-sm transition"
              >
                <User className="w-4 h-4 text-emerald-200" />
                <span className="max-w-[130px] truncate">{user.full_name}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">{t('navbar.loggedInAs')}</p>
                    <p className="text-sm font-bold text-[#07503c] truncate">{user.full_name}</p>
                    <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#e3f1e7] text-[#07503c]">
                      {user.role === 'admin' ? (isTelugu ? 'వ్యవసాయ అధికారి' : 'Agriculture Officer') : `${user.village} ${isTelugu ? 'రైతు' : 'Farmer'}`}
                    </span>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#07503c]"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {t('navbar.dashboard')}
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-amber-800 hover:bg-amber-50"
                    >
                      <Shield className="w-4 h-4 text-amber-600" />
                      {t('navbar.adminControl')}
                    </Link>
                  )}

                  <Link
                    to="/track-complaint"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <span>🔍</span> {t('navbar.trackStatus')}
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 text-left font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('navbar.signOut')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/track-complaint"
                className="text-xs font-semibold text-[#07503c] hover:bg-[#e3f1e7] px-2.5 py-2 rounded-md transition"
              >
                {t('navbar.trackStatus')}
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 bg-[#07503c] hover:bg-[#06483d] text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition hover:shadow"
              >
                <User className="w-4 h-4" />
                {t('navbar.farmerLogin')}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Mobile Language Switcher Button */}
          <button
            type="button"
            onClick={() => setLang(language === 'en' ? 'te' : 'en')}
            className="flex items-center gap-1 bg-[#f0f5f2] text-[#07503c] px-2.5 py-1.5 rounded-lg text-xs font-bold border border-[#d2e2d8]"
            title="Switch Language / భాషను మార్చండి"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-700" />
            <span>{language === 'en' ? 'తెలుగు' : 'English'}</span>
          </button>

          {user ? (
            <Link
              to="/dashboard"
              className="text-xs font-bold bg-[#e3f1e7] text-[#07503c] px-2.5 py-1.5 rounded-md truncate max-w-[110px]"
            >
              {user.full_name.split(' ')[0]}
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-xs font-bold bg-[#07503c] text-white px-3 py-1.5 rounded-md"
            >
              {isTelugu ? 'లాగిన్' : 'Login'}
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-[#07503c] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-2 shadow-lg animate-fadeIn">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-semibold ${
                  isActive
                    ? 'text-[#07503c] bg-[#e3f1e7] font-bold'
                    : 'text-[#193d39] hover:bg-gray-50'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-bold text-amber-800 bg-amber-50"
            >
              🛡️ {t('navbar.admin')}
            </NavLink>
          )}

          <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
            <Link
              to="/track-complaint"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center py-2 text-sm font-semibold text-[#07503c] bg-gray-50 rounded-lg"
            >
              🔍 {t('navbar.trackStatus')}
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 text-sm font-bold text-white bg-[#07503c] rounded-lg"
                >
                  {t('navbar.dashboard')}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-sm font-semibold text-rose-600 bg-rose-50 rounded-lg"
                >
                  {t('navbar.signOut')}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 text-sm font-bold text-white bg-[#07503c] rounded-lg"
              >
                {t('navbar.farmerLogin')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
