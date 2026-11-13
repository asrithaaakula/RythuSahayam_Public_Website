import React, { useState, useEffect } from 'react';
import { Landmark, CheckCircle, FileText, ArrowUpRight, Phone, Search, ShieldCheck, HelpCircle } from 'lucide-react';
import { fetchSchemes } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function SchemesLoans() {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeSchemeId, setActiveSchemeId] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetchSchemes(selectedCategory === 'All' ? '' : selectedCategory);
      setSchemes(res.schemes || []);
      if (res.schemes?.length > 0 && !activeSchemeId) {
        setActiveSchemeId(res.schemes[0].id);
      }
      setLoading(false);
    }
    load();
  }, [selectedCategory]);

  const categoryOptions = [
    { key: 'All', label: t('schemes.allSchemes') },
    { key: 'Central Govt', label: t('schemes.centralGovt') },
    { key: 'AP State Govt', label: t('schemes.stateGovt') },
    { key: 'Credit & Loan', label: t('schemes.creditLoan') },
    { key: 'Subsidy', label: t('schemes.subsidy') },
    { key: 'Insurance', label: t('schemes.insurance') },
    { key: 'Soil & Quality', label: t('schemes.soilQuality') }
  ];

  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.benefits.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const activeScheme = filteredSchemes.find((s) => s.id === activeSchemeId) || filteredSchemes[0];

  return (
    <div className="bg-[#fbfaf5] min-h-screen py-10 px-4 sm:px-[6%]">
      <div className="max-w-[1300px] mx-auto space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#073e32] to-[#0b4b3d] text-white p-6 sm:p-8 rounded-2xl shadow-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-200 text-xs font-bold mb-3">
            <span>🏛️</span> {t('schemes.badge')}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold mb-2">
            {t('schemes.title')}
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed">
            {t('schemes.desc')}
          </p>

          {/* Search & Filter */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('schemes.searchPlaceholder')}
                className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 bg-white/10 p-1.5 rounded-xl border border-white/20">
              {categoryOptions.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedCategory === cat.key
                      ? 'bg-white text-[#07503c] shadow'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="text-center py-20 text-[#07503c] font-bold">
            {t('common.loading')}
          </div>
        ) : filteredSchemes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8">
            <p className="text-lg font-bold text-gray-700">{t('schemes.noSchemes')}</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-3 text-sm font-bold text-[#07503c] underline"
            >
              {t('schemes.resetFilters')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Schemes List */}
            <div className="lg:col-span-5 space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#0b4b3d] px-1">
                {t('schemes.availablePrograms')} ({filteredSchemes.length})
              </h2>
              <div className="space-y-2.5">
                {filteredSchemes.map((scheme) => {
                  const isSelected = activeScheme?.id === scheme.id;
                  return (
                    <button
                      key={scheme.id}
                      onClick={() => setActiveSchemeId(scheme.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-[#07503c] text-white border-[#07503c] shadow-md scale-[1.01]'
                          : 'bg-white text-gray-800 border-[#e2e7e7] hover:border-[#b9d8ca] hover:bg-[#f6f9f7]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-white/20 text-emerald-100' : 'bg-[#eaf2e9] text-[#07503c]'
                        }`}>
                          {scheme.category}
                        </span>
                        <span className={`text-xs ${isSelected ? 'text-emerald-200' : 'text-gray-400'}`}>
                          📞 {scheme.helpline}
                        </span>
                      </div>
                      <h3 className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-[#06483d]'}`}>
                        {scheme.title}
                      </h3>
                      <p className={`text-xs mt-1 line-clamp-2 ${isSelected ? 'text-emerald-100/90' : 'text-gray-500'}`}>
                        {scheme.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Detailed Scheme View */}
            {activeScheme && (
              <div className="lg:col-span-7 bg-white rounded-2xl border border-[#e2e7e7] p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#eaf2e9] text-[#07503c]">
                      {activeScheme.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {activeScheme.ministry_state}
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#06483d]">
                    {activeScheme.title}
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed mt-2">
                    {activeScheme.description}
                  </p>
                </div>

                {/* Key Benefits */}
                <div className="bg-[#f6fbf7] p-4 sm:p-5 rounded-xl border border-emerald-100 space-y-2">
                  <h4 className="text-sm font-bold text-[#07503c] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    {t('schemes.benefitsTitle')}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
                    {activeScheme.benefits}
                  </p>
                </div>

                {/* Eligibility */}
                <div className="bg-[#fbfbf9] p-4 sm:p-5 rounded-xl border border-gray-100 space-y-2">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    {t('schemes.eligibilityTitle')}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    {activeScheme.eligibility}
                  </p>
                </div>

                {/* Required Documents */}
                <div className="bg-[#fffcf7] p-4 sm:p-5 rounded-xl border border-amber-100 space-y-2">
                  <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-700" />
                    {t('schemes.documentsTitle')}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    {activeScheme.documents_needed}
                  </p>
                </div>

                {/* Application Steps */}
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 space-y-2">
                  <h4 className="text-sm font-bold text-[#06483d] flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#07503c]" />
                    {t('schemes.applyTitle')}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    {activeScheme.application_steps}
                  </p>
                </div>

                {/* Official Links & Helpline */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Phone className="w-4 h-4 text-[#07503c]" />
                    <span>{t('schemes.helplineLabel')} <strong className="text-gray-900">{activeScheme.helpline}</strong></span>
                  </div>

                  {activeScheme.portal_url && (
                    <a
                      href={activeScheme.portal_url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#07503c] hover:bg-[#06483d] text-white text-xs font-bold rounded-xl shadow transition"
                    >
                      <span>{t('schemes.visitPortalBtn')}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
