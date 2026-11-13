import React, { useState, useEffect } from 'react';
import { Search, Sprout, Droplets, ShieldAlert, Sparkles, Filter, ChevronRight, Calendar, Layers, Clock } from 'lucide-react';
import { fetchCrops } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function CropGuidance() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeCropId, setActiveCropId] = useState(null);

  const { t, isTelugu } = useLanguage();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetchCrops(selectedCategory, searchTerm);
      setCrops(res.crops || []);
      if (res.crops && res.crops.length > 0 && !activeCropId) {
        setActiveCropId(res.crops[0].id);
      }
      setLoading(false);
    }
    load();
  }, [selectedCategory, searchTerm]);

  const categories = [
    { id: 'All', name: t('cropGuidance.allCategories') },
    { id: 'Cereals', name: t('cropGuidance.cereals') },
    { id: 'Spices & Cash Crop', name: t('cropGuidance.spices') },
    { id: 'Commercial Cash Crop', name: t('cropGuidance.commercial') },
    { id: 'Horticulture', name: t('cropGuidance.horticulture') }
  ];

  const activeCrop = crops.find((c) => c.id === activeCropId) || crops[0];

  return (
    <div className="bg-[#fbfaf5] min-h-screen py-10 px-4 sm:px-[6%]">
      <div className="max-w-[1300px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#073e32] to-[#0b4b3d] text-white p-6 sm:p-8 rounded-2xl shadow-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-200 text-xs font-bold mb-3">
            <span>🌱</span> {t('cropGuidance.badge')}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold mb-2">
            {t('cropGuidance.title')}
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed">
            {t('cropGuidance.desc')}
          </p>

          {/* Search & Filter Bar */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative md:col-span-2">
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('cropGuidance.searchPlaceholder')}
                className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
              />
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-transparent text-white text-sm font-semibold px-3 py-2 focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="text-gray-900 bg-white">
                    {t('cropGuidance.categoryPrefix')} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content Layout: Crop Selection List + Deep Dive Guide */}
        {loading ? (
          <div className="text-center py-20 text-[#07503c] font-bold">
            {t('common.loading')}
          </div>
        ) : crops.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8">
            <p className="text-lg font-bold text-gray-700">{t('cropGuidance.noMatch')}</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="mt-3 text-sm font-bold text-[#07503c] underline"
            >
              {t('cropGuidance.resetFilters')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Crop Cards Selection List */}
            <div className="lg:col-span-4 space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#0b4b3d] px-1">
                {t('cropGuidance.selectCrop')} ({crops.length})
              </h2>
              <div className="space-y-2">
                {crops.map((crop) => {
                  const isSelected = activeCrop?.id === crop.id;
                  return (
                    <button
                      key={crop.id}
                      onClick={() => setActiveCropId(crop.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#07503c] text-white border-[#07503c] shadow-md scale-[1.01]'
                          : 'bg-white text-gray-800 border-[#e2e7e7] hover:border-[#b9d8ca] hover:bg-[#f6f9f7]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-2 rounded-lg bg-black/5">{crop.icon}</span>
                        <div>
                          <p className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-[#06483d]'}`}>
                            {isTelugu && crop.telugu_name ? crop.telugu_name : crop.name}
                          </p>
                          <p className={`text-xs ${isSelected ? 'text-emerald-200' : 'text-gray-500'}`}>
                            {isTelugu ? crop.name : crop.telugu_name}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-emerald-200' : 'text-gray-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Complete Agronomic Guide */}
            {activeCrop && (
              <div className="lg:col-span-8 bg-white rounded-2xl border border-[#e2e7e7] p-6 sm:p-8 shadow-sm space-y-6">
                {/* Crop Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl p-3 rounded-2xl bg-[#e3f1e7]">{activeCrop.icon}</span>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#06483d]">
                        {isTelugu && activeCrop.telugu_name ? activeCrop.telugu_name : activeCrop.name}
                      </h2>
                      <p className="text-base font-semibold text-[#07503c]">
                        {isTelugu ? activeCrop.name : activeCrop.telugu_name}
                      </p>
                    </div>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#eaf2e9] text-[#07503c] border border-[#cae5d3]">
                    {activeCrop.category}
                  </span>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-[#f8faf8] p-3.5 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-[#07503c]" />
                      <span>{t('cropGuidance.optimalSeason')}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-gray-900">{activeCrop.season}</p>
                  </div>
                  <div className="bg-[#f8faf8] p-3.5 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
                      <Clock className="w-3.5 h-3.5 text-[#07503c]" />
                      <span>{t('cropGuidance.duration')}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-gray-900">{activeCrop.duration}</p>
                  </div>
                  <div className="bg-[#f8faf8] p-3.5 rounded-xl border border-gray-100 col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t('cropGuidance.avgYield')}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#07503c]">{activeCrop.yield_per_acre}</p>
                  </div>
                </div>

                {/* Detailed Sections */}
                <div className="space-y-5 text-sm">
                  {/* Soil & Sowing */}
                  <div className="bg-[#fbfbf9] p-4 sm:p-5 rounded-xl border border-gray-100 space-y-3">
                    <h3 className="font-bold text-[#07503c] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-700" />
                      {t('cropGuidance.soilTitle')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-700">
                      <div>
                        <span className="font-bold text-gray-900 block mb-1">{t('cropGuidance.soilTypeLabel')}</span>
                        <p className="leading-relaxed">{activeCrop.soil_type}</p>
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block mb-1">{t('cropGuidance.sowingWindowLabel')}</span>
                        <p className="leading-relaxed">{activeCrop.sowing_time}</p>
                      </div>
                    </div>
                  </div>

                  {/* Water & Irrigation */}
                  <div className="bg-[#f6f9fc] p-4 sm:p-5 rounded-xl border border-blue-100 space-y-2">
                    <h3 className="font-bold text-blue-900 flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-600" />
                      {t('cropGuidance.waterTitle')}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {activeCrop.water_requirement}
                    </p>
                  </div>

                  {/* Fertilizer Management */}
                  <div className="bg-[#fcfbf6] p-4 sm:p-5 rounded-xl border border-amber-100 space-y-2">
                    <h3 className="font-bold text-amber-900 flex items-center gap-2">
                      <Sprout className="w-4 h-4 text-amber-700" />
                      {t('cropGuidance.fertilizerTitle')}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {activeCrop.fertilizer_info}
                    </p>
                  </div>

                  {/* Pest & Disease Control */}
                  <div className="bg-[#fff7f7] p-4 sm:p-5 rounded-xl border border-rose-100 space-y-2">
                    <h3 className="font-bold text-rose-900 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      {t('cropGuidance.pestTitle')}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {activeCrop.pest_disease_info}
                    </p>
                  </div>

                  {/* Harvesting & Post-Harvest */}
                  <div className="bg-[#f7f9f7] p-4 sm:p-5 rounded-xl border border-emerald-100 space-y-2">
                    <h3 className="font-bold text-[#07503c] flex items-center gap-2">
                      <span>🌾</span>
                      {t('cropGuidance.harvestTitle')}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {activeCrop.harvesting_info}
                    </p>
                  </div>
                </div>

                {/* Local Action Footer */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <p className="text-gray-500">
                    {t('cropGuidance.needSeeds')}
                  </p>
                  <a
                    href={`/report-problem?crop=${encodeURIComponent(activeCrop.name)}&category=Crop%20Diseases`}
                    className="py-2 px-4 bg-[#07503c] text-white font-bold rounded-lg hover:bg-[#06483d] transition shadow-sm"
                  >
                    {t('cropGuidance.reportIssueBtn')}
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
