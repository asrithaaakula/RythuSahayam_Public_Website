import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Droplets, Sprout, Landmark, Bug, CloudSun, IndianRupee, Wheat, ExternalLink, CheckCircle2, AlertCircle, Phone, X } from 'lucide-react';
import { fetchWeather, fetchMarketPrices, searchSupport } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const navigate = useNavigate();
  const { t, language, isTelugu } = useLanguage();

  // Search panel state
  const [village, setVillage] = useState('Prathuru');
  const [cropType, setCropType] = useState('Select Crop Type');
  const [problemCategory, setProblemCategory] = useState('Select Category');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Weather state
  const [weatherVillage, setWeatherVillage] = useState('Prathuru');
  const [weatherData, setWeatherData] = useState(null);

  // Market prices state
  const [marketPrices, setMarketPrices] = useState([]);

  // Selected Common Problem modal
  const [selectedProblem, setSelectedProblem] = useState(null);

  useEffect(() => {
    async function loadInitialData() {
      const weather = await fetchWeather(weatherVillage);
      setWeatherData(weather);

      const pricesRes = await fetchMarketPrices();
      setMarketPrices(pricesRes.prices.slice(0, 4));
    }
    loadInitialData();
  }, [weatherVillage]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchLoading(true);
    const results = await searchSupport(village, cropType === 'Select Crop Type' ? '' : cropType, problemCategory === 'Select Category' ? '' : problemCategory);
    setSearchResults(results);
    setSearchLoading(false);
  };

  // Village problem categories metadata
  const problemDetails = {
    'Irrigation & Electricity': {
      title: 'Irrigation Water Scarcity & Low Power Voltage',
      description: 'Farmers in Prathuru and Gundimeda often face tail-end canal water shortage during peak transplanting and intermittent voltage fluctuations on rural 3-phase agricultural feeders.',
      guidance: 'Canal schedule is governed by Krishna Western Delta. Low voltage complaints can be registered directly with APCPDCL Tadepalli Substation or via RythuSahayam.',
      officialSupport: 'AP Micro Irrigation Project (APMIP) provides up to 90% subsidy for Drip & Sprinkler sets.',
      recommendedCategory: 'Irrigation'
    },
    'Loan Access': {
      title: 'Institutional Credit & Kisan Credit Card (KCC) Access',
      description: 'Tenant farmers without CCRC cards and small landholders often struggle with paperless institutional bank loans and are subjected to high non-institutional interest rates.',
      guidance: 'Rythu Seva Kendras (RSK) in Prathuru and Gundimeda issue Crop Cultivator Rights Cards (CCRC). Eligible for subsidized 4% interest crop loans up to ₹3,00,000.',
      officialSupport: 'NABARD KCC scheme with zero collateral required for limits up to ₹1.60 Lakh.',
      recommendedCategory: 'Loans'
    },
    'Crop Storage': {
      title: 'Warehouse & Cold Storage Near Tadepalli',
      description: 'Lack of affordable micro-warehousing causes distress selling of harvested chilli, paddy, and perishable vegetables immediately after cutting.',
      guidance: 'AP State Warehousing Corporation operates godowns at Mangalagiri and Tenali with 50% storage subsidy for small farmers. E-NAM warehouse receipts also eligible for pledge loans.',
      officialSupport: 'Agricultural Infrastructure Fund (AIF) subsidy for building on-farm pack houses and solar dryers.',
      recommendedCategory: 'Crop Storage'
    },
    'Transport to Market': {
      title: 'Farm-to-Mandi Transportation & Logistics',
      description: 'Transporting gunny bags to Guntur Mirchi Yard or Vijayawada Wholesale Mandi incurs heavy freight charges when arranged individually.',
      guidance: 'Group aggregation via Tadepalli Mandal Rythu Bharosa FPO enables pooled mini-truck transport reducing hauling costs by 40%.',
      officialSupport: 'Kisan Rath mobile app connects farmers with registered local tractor and truck logistics providers.',
      recommendedCategory: 'Transportation'
    },
    'Fair Crop Prices': {
      title: 'MSP Procurement & Mandi Price Realization',
      description: 'Intermediary price cuts and lack of real-time mandi rate transparency hurt farmer earnings for commercial crops like Chilli and Cotton.',
      guidance: 'Check live AGMARKNET and Guntur Market Yard auction rates daily on RythuSahayam before agreeing to farm-gate buyer quotes.',
      officialSupport: 'AP Markfed MSP procurement centers operational at PACS Tadepalli for notified grains.',
      recommendedCategory: 'Market Prices'
    }
  };

  return (
    <div className="bg-[#fbfaf5] min-h-screen">
      {/* ================= HERO SECTION ================= */}
      <section className="text-center pt-10 pb-8 px-4 sm:px-[5%] bg-gradient-to-b from-[#f2f4e9] to-[#fbfaf5] border-b border-[#e9ede0]">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#edf2ee] text-gray-700 text-xs font-semibold mb-3 border border-[#d6e0d8]">
            <span className="text-amber-500 font-bold text-sm">✦</span> {t('heroBadge')}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-[#111827] tracking-tight leading-tight mb-2.5">
            {t('heroHeading')}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {t('heroDescription')}
          </p>

          {/* ================= FARMER SUPPORT SEARCH PANEL ================= */}
          <div className="mt-8 max-w-[1050px] mx-auto bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs text-left">
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              {/* Field 1: Village */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  {t('villageLabel')}
                </label>
                <select
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full p-2.5 sm:p-3 text-sm bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-medium"
                >
                  <option value="Prathuru">{isTelugu ? 'ప్రాతూరు' : 'Prathuru'}</option>
                  <option value="Gundimeda">{isTelugu ? 'గుండిమెడ' : 'Gundimeda'}</option>
                </select>
              </div>

              {/* Field 2: Crop Type */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  {t('cropTypeLabel')}
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full p-2.5 sm:p-3 text-sm bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-medium"
                >
                  <option value="Select Crop Type">{t('selectCropType')}</option>
                  <option value="Paddy">{isTelugu ? 'వరి (Paddy)' : 'Paddy (వరి)'}</option>
                  <option value="Cotton">{isTelugu ? 'ప్రత్తి (Cotton)' : 'Cotton (ప్రత్తి)'}</option>
                  <option value="Chilli">{isTelugu ? 'మిరప (Chilli)' : 'Chilli (మిరప)'}</option>
                  <option value="Maize">{isTelugu ? 'మొక్కజొన్న (Maize)' : 'Maize (మొక్కజొన్న)'}</option>
                  <option value="Vegetables">{isTelugu ? 'కూరగాయలు (Vegetables)' : 'Vegetables (కూరగాయలు)'}</option>
                  <option value="Other">{isTelugu ? 'ఇతర పంట' : 'Other Crop'}</option>
                </select>
              </div>

              {/* Field 3: Problem Category */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  {t('problemCategoryLabel')}
                </label>
                <select
                  value={problemCategory}
                  onChange={(e) => setProblemCategory(e.target.value)}
                  className="w-full p-2.5 sm:p-3 text-sm bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-medium"
                >
                  <option value="Select Category">{t('selectCategory')}</option>
                  <option value="Irrigation">{isTelugu ? 'సాగునీరు & నీటి కొరత' : 'Irrigation & Water'}</option>
                  <option value="Electricity">{isTelugu ? 'వ్యవసాయ విద్యుత్ & మోటార్' : 'Electricity & Power'}</option>
                  <option value="Seeds and Fertilizers">{isTelugu ? 'విత్తనాలు & ఎరువుల లభ్యత' : 'Seeds and Fertilizers'}</option>
                  <option value="Loans">{isTelugu ? 'రుణాలు & ప్రభుత్వ పథకాలు' : 'Loans & Schemes'}</option>
                  <option value="Crop Diseases">{isTelugu ? 'పంట తెగుళ్లు & పురుగులు' : 'Crop Diseases & Pests'}</option>
                  <option value="Storage">{isTelugu ? 'పంట నిల్వ & గోదాములు' : 'Storage & Godowns'}</option>
                  <option value="Transportation">{isTelugu ? 'రవాణా & మార్కెట్ చేరవేత' : 'Transportation'}</option>
                  <option value="Market Prices">{isTelugu ? 'మార్కెట్ ధరలు & గిట్టుబాటు' : 'Market Prices'}</option>
                  <option value="Other">{isTelugu ? 'ఇతర వ్యవసాయ సమస్య' : 'Other Agricultural Issue'}</option>
                </select>
              </div>

              {/* Field 4: Find Support Button */}
              <div>
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="w-full p-2.5 sm:p-3 bg-[#0a1a15] hover:bg-[#152a22] text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2 shadow-2xs transition cursor-pointer disabled:opacity-70"
                >
                  <Search className="w-4 h-4 text-sky-400" />
                  <span>{searchLoading ? t('searching') : t('findSupportBtn')}</span>
                </button>
              </div>
            </form>

            {/* Dynamic Search Results Panel */}
            {searchResults && (
              <div className="mt-4 pt-4 border-t border-[#e2e7e7] animate-fadeIn">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#07503c]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{isTelugu ? `${searchResults.village} గ్రామ సమాచారం:` : `Support results for ${searchResults.village} village`}</span>
                  </div>
                  <button
                    onClick={() => setSearchResults(null)}
                    className="text-xs text-gray-500 hover:text-gray-800"
                  >
                    {isTelugu ? 'ఫలితాలు తొలగించండి ✕' : 'Clear Results ✕'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Local Assistance Contact */}
                  <div className="bg-[#f6f9f7] p-3 rounded-lg border border-[#dbe6df] text-xs">
                    <p className="font-bold text-[#07503c] mb-1">📍 {isTelugu ? 'గ్రామ రైతు సేవా కేంద్రం' : 'Local Village Center'}</p>
                    <p className="font-semibold text-gray-800">{searchResults.local_contacts.rsk_name}</p>
                    <p className="text-gray-600 mt-0.5">{searchResults.local_contacts.vaa_name}</p>
                    <p className="text-emerald-700 font-bold mt-1">📞 {searchResults.local_contacts.contact}</p>
                  </div>

                  {/* Matched Crop Guidance */}
                  {searchResults.matched_crop ? (
                    <div className="bg-[#fbfbf6] p-3 rounded-lg border border-[#e8ebd9] text-xs">
                      <p className="font-bold text-amber-900 mb-1">🌾 {isTelugu ? 'పంట సలహా' : 'Crop Advisory'} ({searchResults.matched_crop.name})</p>
                      <p className="text-gray-700 line-clamp-2">{searchResults.matched_crop.fertilizer_info}</p>
                      <Link to="/crop-guidance" className="text-[#07503c] font-bold inline-flex items-center gap-1 mt-1 hover:underline">
                        {isTelugu ? 'పూర్తి మార్గదర్శకం చూడండి' : 'View full crop guide'} <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-[#fbfbf6] p-3 rounded-lg border border-[#e8ebd9] text-xs">
                      <p className="font-bold text-amber-900 mb-1">🌾 {isTelugu ? 'పంట మార్గదర్శకత్వం' : 'General Crop Guidance'}</p>
                      <p className="text-gray-700">{isTelugu ? 'నేల, ఎరువులు మరియు పురుగుల నివారణ సూచనలు లభ్యం.' : 'Detailed soil, fertilizer, and pest management guides available.'}</p>
                      <Link to="/crop-guidance" className="text-[#07503c] font-bold inline-flex items-center gap-1 mt-1 hover:underline">
                        {isTelugu ? 'పంటల పోర్టల్ చూడండి' : 'Explore Crop Portal'} <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}

                  {/* Immediate Action / Filing */}
                  <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-200 text-xs flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-[#07503c] mb-1">📝 {isTelugu ? 'సహాయం అవసరమా?' : 'Need Direct Assistance?'}</p>
                      <p className="text-gray-600">{isTelugu ? 'గ్రామ అధికారి పరిశీలన కోసం ఫిర్యాదు నమోదు చేయండి.' : 'Submit an official complaint ticket for village inspection.'}</p>
                    </div>
                    <Link
                      to={`/report-problem?village=${encodeURIComponent(searchResults.village)}&crop=${encodeURIComponent(cropType !== 'Select Crop Type' ? cropType : '')}&category=${encodeURIComponent(problemCategory !== 'Select Category' ? problemCategory : '')}`}
                      className="mt-2 w-full py-1.5 px-3 bg-[#07503c] text-white text-center font-bold rounded-md hover:bg-[#06483d] transition"
                    >
                      {isTelugu ? 'సమస్యను నివేదించండి' : 'Report This Problem'}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-[1300px] mx-auto px-4 sm:px-[6%] py-8 sm:py-12 space-y-12">
        {/* ================= ESSENTIAL FARMER SERVICES ================= */}
        <section id="services">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-[#111827]">
              {t('essentialServicesHeading')}
            </h2>
            <span className="text-xs text-[#61717e] hidden sm:inline">{t('essentialServicesSub')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* CARD 1: IRRIGATION SUPPORT */}
            <Link
              to="/irrigation"
              className="group bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-2xl text-sky-600 mb-4 group-hover:scale-105 transition-transform">
                  💧
                </div>
                <h3 className="text-[17px] font-bold text-[#111827] group-hover:text-[#07503c] mb-2">
                  {t('service1Title')}
                </h3>
                <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed mb-6">
                  {t('service1Desc')}
                </p>
              </div>
              <div className="pt-2">
                <span className="text-xs font-semibold text-gray-700 hover:text-emerald-800 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {t('common.viewDetails')}
                </span>
              </div>
            </Link>

            {/* CARD 2: SEEDS & FERTILIZERS */}
            <Link
              to="/crop-guidance"
              className="group bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl text-emerald-700 mb-4 group-hover:scale-105 transition-transform">
                  🌱
                </div>
                <h3 className="text-[17px] font-bold text-[#111827] group-hover:text-[#07503c] mb-2">
                  {t('service2Title')}
                </h3>
                <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed mb-6">
                  {t('service2Desc')}
                </p>
              </div>
              <div className="pt-2">
                <span className="text-xs font-semibold text-gray-700 hover:text-emerald-800 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {t('common.viewDetails')}
                </span>
              </div>
            </Link>

            {/* CARD 3: GOVERNMENT SCHEMES & LOANS */}
            <Link
              to="/schemes"
              className="group bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl text-slate-700 mb-4 group-hover:scale-105 transition-transform">
                  🏛️
                </div>
                <h3 className="text-[17px] font-bold text-[#111827] group-hover:text-[#07503c] mb-2">
                  {t('service3Title')}
                </h3>
                <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed mb-6">
                  {t('service3Desc')}
                </p>
              </div>
              <div className="pt-2">
                <span className="text-xs font-semibold text-gray-700 hover:text-emerald-800 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {t('common.viewDetails')}
                </span>
              </div>
            </Link>

            {/* CARD 4: REPORT CROP PROBLEMS */}
            <Link
              to="/report-problem"
              className="group bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl text-emerald-700 mb-4 group-hover:scale-105 transition-transform">
                  🐛
                </div>
                <h3 className="text-[17px] font-bold text-[#111827] group-hover:text-[#07503c] mb-2">
                  {t('service4Title')}
                </h3>
                <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed mb-6">
                  {t('service4Desc')}
                </p>
              </div>
              <div className="pt-2">
                <span className="text-xs font-semibold text-gray-700 hover:text-emerald-800 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {t('common.viewDetails')}
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* ================= LOCAL AGRICULTURAL SUPPORT ================= */}
        <section id="local-support">
          <h2 className="text-2xl font-bold text-[#111827] mb-6">
            {t('localSupportHeading')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* CARD 1: WEATHER & CROP ALERTS */}
            <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                    🌦️
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#eaf2e9] text-[#07503c]">
                    {t('card1Badge')}
                  </span>
                </div>

                <h3 className="text-[17px] font-bold text-[#111827] mb-1">
                  {t('card1Title')}
                </h3>
                <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed mb-3">
                  {t('card1Desc')}
                </p>

                {/* Village Selector & Live Weather Metrics */}
                <div className="bg-[#f8faf8] p-3 rounded-lg border border-[#e3ebe4] mb-3 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700">{isTelugu ? 'గ్రామం ఎంచుకోండి:' : 'Select Village:'}</span>
                    <div className="inline-flex rounded-md shadow-2xs">
                      <button
                        onClick={() => setWeatherVillage('Prathuru')}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-l-md ${weatherVillage === 'Prathuru' ? 'bg-[#07503c] text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
                      >
                        {isTelugu ? 'ప్రాతూరు' : 'Prathuru'}
                      </button>
                      <button
                        onClick={() => setWeatherVillage('Gundimeda')}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-r-md ${weatherVillage === 'Gundimeda' ? 'bg-[#07503c] text-white' : 'bg-white text-gray-700 border border-gray-200 border-l-0'}`}
                      >
                        {isTelugu ? 'గుండిమెడ' : 'Gundimeda'}
                      </button>
                    </div>
                  </div>

                  {weatherData && (
                    <div className="space-y-1.5 pt-1 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-extrabold text-[#07503c]">{weatherData.temperature}°C</span>
                        <span className="text-gray-600 font-medium">{isTelugu ? 'ఆకాశం పాక్షికంగా నిర్మలం' : weatherData.condition}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span>{isTelugu ? 'తేమ:' : 'Humidity:'} {weatherData.humidity}%</span>
                        <span>{isTelugu ? 'వర్ష సూచన:' : 'Rain Chance:'} {weatherData.rainfall_chance}%</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 font-medium pt-1 border-t border-dashed border-gray-200">
                        🌾 {isTelugu ? 'పంట సలహా:' : 'Advisory:'} {weatherData.advisories[0]}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <a
                href="https://mausam.imd.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#07503c] hover:underline inline-flex items-center gap-1 mt-2"
              >
                {t('card1Link')}
              </a>
            </div>

            {/* CARD 2: MARKET PRICE UPDATES */}
            <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl font-bold text-emerald-800">
                    ₹
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#eaf2e9] text-[#07503c]">
                    {t('card2Badge')}
                  </span>
                </div>

                <h3 className="text-[17px] font-bold text-[#111827] mb-1">
                  {t('card2Title')}
                </h3>
                <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed mb-3">
                  {t('card2Desc')}
                </p>

                {/* Local Price Ticker */}
                <div className="bg-[#f8faf8] p-3 rounded-lg border border-[#e3ebe4] mb-3 text-xs space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 border-b border-gray-200 pb-1">
                    <span>{isTelugu ? 'పంట (గుంటూరు యార్డ్)' : 'Crop (Guntur Mandi)'}</span>
                    <span>{isTelugu ? 'సగటు ధర / క్వింటాల్' : 'Modal Price / Qtl'}</span>
                  </div>
                  {marketPrices.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-gray-800 truncate max-w-[130px]">{item.crop}</span>
                      <span className="font-bold text-[#07503c]">₹{item.modal_price.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="pt-1 text-[10px] text-gray-500 text-right">
                    {isTelugu ? 'అధికారిక మార్కెట్ ధరలు' : 'Official Mandi Rates'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <a
                  href="https://agmarknet.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#07503c] hover:underline inline-flex items-center gap-1"
                >
                  {t('card2Link')}
                </a>
                <Link to="/market-prices" className="text-xs font-bold text-emerald-800 hover:text-[#07503c]">
                  {t('card2AllRates')}
                </Link>
              </div>
            </div>

            {/* CARD 3: SOIL TESTING & CROP ADVICE */}
            <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl text-amber-800">
                    🌾
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#eaf2e9] text-[#07503c]">
                    {t('card3Badge')}
                  </span>
                </div>

                <h3 className="text-[17px] font-bold text-[#111827] mb-1">
                  {t('card3Title')}
                </h3>
                <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed mb-3">
                  {t('card3Desc')}
                </p>

                {/* Soil Testing Summary */}
                <div className="bg-[#f8faf8] p-3 rounded-lg border border-[#e3ebe4] mb-3 text-xs space-y-1.5">
                  <p className="font-semibold text-gray-800">🧪 {isTelugu ? 'సాయిల్ హెల్త్ కార్డ్ నేల పరీక్ష' : 'Soil Health Card Testing Program'}</p>
                  <p className="text-gray-600 text-[11px] leading-relaxed">
                    {isTelugu ? 'విత్తే ముందు నత్రజని, భాస్వరం, పొటాష్ (N-P-K) పరీక్షించి ఎరువుల ఖర్చులో 25% వరకు ఆదా చేసుకోండి.' : 'Test Nitrogen, Phosphorus, Potassium (N-P-K) & micronutrients before sowing to save up to 25% on fertilizer expenses.'}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-1 rounded">
                    <span>📍 {isTelugu ? 'శిబిరం:' : 'Camp:'}</span> {isTelugu ? 'ప్రతి శనివారం ఉదయం ప్రాతూరు RSK లో' : 'Prathuru RSK every Saturday morning'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <a
                  href="https://apagrisnet.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#07503c] hover:underline inline-flex items-center gap-1"
                >
                  {t('card3Link')}
                </a>
                <Link to="/schemes" className="text-xs font-bold text-emerald-800 hover:text-[#07503c]">
                  {t('card3Details')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= COMMON PROBLEMS IN OUR VILLAGES ================= */}
        <section id="common-problems">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0b4b3d]">
              {t('commonProblemsHeading')}
            </h2>
            <Link
              to="/report-problem"
              className="inline-flex items-center gap-1.5 bg-[#07503c] hover:bg-[#06483d] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-full shadow-sm transition hover:shadow cursor-pointer self-start sm:self-auto"
            >
              <span>{t('viewAllOptionsBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Horizontally arranged rounded pill-shaped buttons with icons */}
          <div className="flex flex-wrap gap-3 items-center">
            {Object.keys(problemDetails).map((key) => {
              const icons = {
                'Irrigation & Electricity': '💧',
                'Loan Access': '▤',
                'Crop Storage': '🏠',
                'Transport to Market': '🚚',
                'Fair Crop Prices': '₹'
              };

              const teluguLabels = {
                'Irrigation & Electricity': '💧 సాగునీరు & విద్యుత్',
                'Loan Access': '▤ రుణ సదుపాయం',
                'Crop Storage': '🏠 పంట నిల్వ & గోదాములు',
                'Transport to Market': '🚚 మార్కెట్‌కు రవాణా',
                'Fair Crop Prices': '₹ గిట్టుబాటు ధరలు'
              };

              return (
                <button
                  key={key}
                  onClick={() => setSelectedProblem({ name: key, ...problemDetails[key] })}
                  className="bg-[#eaf2e9] hover:bg-[#d8e8d6] text-[#07503c] border border-[#d6e5d5] rounded-full px-4 sm:px-5 py-2.5 sm:py-3 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition hover:scale-[1.02] cursor-pointer"
                >
                  <span className="text-base">{icons[key]}</span>
                  <span>{isTelugu ? teluguLabels[key].split(' ').slice(1).join(' ') : key}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ================= LOCAL VILLAGE FOCUS BANNER ================= */}
        <section className="bg-gradient-to-r from-[#073e32] to-[#0b4b3d] text-white rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-2">
              <span className="inline-block text-xs uppercase tracking-wider font-bold bg-white/20 text-emerald-200 px-3 py-1 rounded-full">
                {t('bannerBadge')}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {t('bannerHeading')}
              </h3>
              <p className="text-sm text-emerald-100/90 leading-relaxed max-w-xl">
                {t('bannerDesc')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
              <Link
                to="/report-problem"
                className="w-full text-center py-3 px-5 bg-white text-[#07503c] font-bold rounded-xl text-sm shadow hover:bg-emerald-50 transition"
              >
                {t('bannerFileBtn')}
              </Link>
              <Link
                to="/track-complaint"
                className="w-full text-center py-2.5 px-5 bg-emerald-900/60 hover:bg-emerald-900/90 text-white font-semibold rounded-xl text-sm border border-emerald-700/60 transition"
              >
                {t('bannerTrackBtn')}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ================= PROBLEM CATEGORY MODAL ================= */}
      {selectedProblem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setSelectedProblem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-10 h-10 rounded-full bg-[#e3f1e7] flex items-center justify-center text-xl">
                🌾
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase text-[#07503c] bg-[#eaf2e9] px-2 py-0.5 rounded-full">
                  Village Issue Advisory
                </span>
                <h3 className="text-lg font-bold text-[#06483d] mt-0.5">
                  {selectedProblem.name}
                </h3>
              </div>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              {selectedProblem.description}
            </p>

            <div className="space-y-3 bg-[#f8faf8] p-3.5 rounded-xl border border-[#e3ebe4] text-xs mb-5">
              <div>
                <p className="font-bold text-[#07503c] mb-0.5">💡 Recommended Action:</p>
                <p className="text-gray-700">{selectedProblem.guidance}</p>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="font-bold text-emerald-900 mb-0.5">🏛️ Available Government Support:</p>
                <p className="text-gray-700">{selectedProblem.officialSupport}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedProblem(null)}
                className="flex-1 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const cat = selectedProblem.recommendedCategory;
                  setSelectedProblem(null);
                  navigate(`/report-problem?category=${encodeURIComponent(cat)}`);
                }}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-[#07503c] hover:bg-[#06483d] rounded-xl shadow transition"
              >
                Report This Problem →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
