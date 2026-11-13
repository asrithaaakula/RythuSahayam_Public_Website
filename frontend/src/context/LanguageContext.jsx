import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n/i18n';
import en from '../i18n/locales/en.json';
import te from '../i18n/locales/te.json';

const LanguageContext = createContext(null);

// Helper to look up dotted keys e.g. "navbar.home" or flat fallback
function getNestedTranslation(obj, path) {
  if (!obj || !path) return null;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return null;
    }
  }
  return typeof current === 'string' ? current : null;
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

  const t = (key) => {
    const currentDict = language === 'te' ? te : en;
    const fallbackDict = en;

    // 1. Try nested key in current language
    const nested = getNestedTranslation(currentDict, key);
    if (nested) return nested;

    // 2. Try nested key in fallback
    const fallbackNested = getNestedTranslation(fallbackDict, key);
    if (fallbackNested) return fallbackNested;

    // 3. Try standard i18next resolution
    const fromI18n = i18n.t(key);
    if (fromI18n && fromI18n !== key) return fromI18n;

    return key;
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
