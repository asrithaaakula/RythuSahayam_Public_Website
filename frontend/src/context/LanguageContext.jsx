import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n/i18n';
import en from '../i18n/locales/en.json';
import te from '../i18n/locales/te.json';

const LanguageContext = createContext(null);

// Helper to look up dotted keys e.g. "navbar.home", or find key in top-level namespaces
function findTranslation(dict, key) {
  if (!dict || !key) return null;

  // 1. Direct key lookup
  if (typeof dict[key] === 'string') return dict[key];

  // 2. Dot-separated path lookup (e.g. "home.heroHeading" or "common.viewDetails")
  if (key.includes('.')) {
    const parts = key.split('.');
    let current = dict;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        current = null;
        break;
      }
    }
    if (typeof current === 'string') return current;
  }

  // 3. Deep namespace lookup (if key was called as "heroHeading" instead of "home.heroHeading")
  for (const ns of Object.keys(dict)) {
    if (dict[ns] && typeof dict[ns] === 'object') {
      if (typeof dict[ns][key] === 'string') {
        return dict[ns][key];
      }
    }
  }

  return null;
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(localStorage.getItem('rs_lang') || 'en');

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('rs_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'te' : 'en';
    setLanguage(nextLang);
    i18n.changeLanguage(nextLang);
    localStorage.setItem('rs_lang', nextLang);
  };

  const setLang = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('rs_lang', lang);
  };

  const t = (key, fallback = '') => {
    const currentDict = language === 'te' ? te : en;
    const fallbackDict = en;

    // 1. Try key in current language dictionary
    const found = findTranslation(currentDict, key);
    if (found) return found;

    // 2. Try key in English fallback dictionary
    const fallbackFound = findTranslation(fallbackDict, key);
    if (fallbackFound) return fallbackFound;

    // 3. Try standard i18next resolution
    const fromI18n = i18n.t(key);
    if (fromI18n && fromI18n !== key) return fromI18n;

    // 4. Return provided fallback string if provided, otherwise the key
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLang, t, isTelugu: language === 'te' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
