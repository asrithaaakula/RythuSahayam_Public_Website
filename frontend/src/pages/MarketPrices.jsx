import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, TrendingDown, Minus, Filter, RefreshCw, BarChart2, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { fetchMarketPrices } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function MarketPrices() {
  const { t } = useLanguage();
  const [prices, setPrices] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedMarket, setSelectedMarket] = useState('All');
  const [loading, setLoading] = useState(true);
  const [sourceInfo, setSourceInfo] = useState('');
  const [updatedTime, setUpdatedTime] = useState('');

  useEffect(() => {
    loadPrices();
  }, [selectedCrop, selectedMarket]);

  const loadPrices = async () => {
    setLoading(true);
    const res = await fetchMarketPrices(selectedCrop, selectedMarket);
    setPrices(res.prices || []);
    setSourceInfo(res.source || 'AGMARKNET & Guntur Agricultural Market Committee');
    setUpdatedTime(res.updated_time || 'Today, 11:30 AM');
    setLoading(false);
  };

  const cropsList = ['All', 'Paddy', 'Chilli', 'Cotton', 'Maize', 'Tomato', 'Brinjal'];
  const marketsList = ['All', 'Guntur', 'Tenali', 'Vijayawada', 'Tadepalli'];

  const chartData = prices.map((item) => ({
    name: item.crop.length > 15 ? item.crop.substring(0, 14) + '...' : item.crop,
    modalPrice: item.modal_price,
    minPrice: item.min_price,
    maxPrice: item.max_price
  }));

  return (
    <div className="bg-[#fbfaf5] min-h-screen py-10 px-4 sm:px-[6%]">
      <div className="max-w-[1300px] mx-auto space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#073e32] to-[#0b4b3d] text-white p-6 sm:p-8 rounded-2xl shadow-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-200 text-xs font-bold mb-3">
            <span>₹</span> {t('marketPrices.badge')}
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold mb-2">
                {t('marketPrices.title')}
              </h1>
              <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed">
                {t('marketPrices.desc')}
              </p>
            </div>
            <button
              onClick={loadPrices}
              className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition border border-white/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t('marketPrices.refreshRates')}</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-emerald-100 font-bold mb-1">{t('marketPrices.filterCrop')}</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full p-2.5 bg-white text-gray-900 rounded-lg font-semibold focus:outline-none"
              >
                {cropsList.map((c) => (
                  <option key={c} value={c}>{c === 'All' ? t('common.all') : c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-emerald-100 font-bold mb-1">{t('marketPrices.filterMarket')}</label>
              <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="w-full p-2.5 bg-white text-gray-900 rounded-lg font-semibold focus:outline-none"
              >
                {marketsList.map((m) => (
                  <option key={m} value={m}>{m === 'All' ? t('common.all') : `${m} Mandi`}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 flex items-end">
              <div className="w-full bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-800/40 text-[11px] text-emerald-200">
                <span className="font-bold text-white block">{t('marketPrices.sourceLabel')}</span>
                {sourceInfo} • {t('marketPrices.updated')} {updatedTime}
              </div>
            </div>
          </div>
        </div>

        {/* Visual Comparison Chart */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2e7e7] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#07503c]" />
              <h3 className="text-base font-bold text-[#06483d]">
                {t('marketPrices.chartTitle')}
              </h3>
            </div>
            <span className="text-xs text-gray-500 font-medium">{t('marketPrices.standardized')}</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f2f0" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  formatter={(value) => [`₹${value.toLocaleString()}`, t('home.card2PriceHeader') || 'Modal Price / Qtl']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dce2e2' }}
                />
                <Bar dataKey="modalPrice" fill="#07503c" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Price Table */}
        <div className="bg-white rounded-2xl border border-[#e2e7e7] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-base text-[#06483d]">
              {t('marketPrices.boardTitle')} ({prices.length} {t('common.entries') || 'Entries'})
            </h3>
            <a
              href="https://agmarknet.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#07503c] hover:underline flex items-center gap-1"
            >
              <span>Verify on AGMARKNET</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#f6f9f7] text-[#07503c] uppercase text-[11px] font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">{t('marketPrices.colCrop')}</th>
                  <th className="py-3 px-4">{t('marketPrices.colVariety')}</th>
                  <th className="py-3 px-4">{t('marketPrices.colMarket')}</th>
                  <th className="py-3 px-4 text-right">{t('marketPrices.colMin')}</th>
                  <th className="py-3 px-4 text-right">{t('marketPrices.colMax')}</th>
                  <th className="py-3 px-4 text-right">{t('marketPrices.colModal')}</th>
                  <th className="py-3 px-4 text-center">{t('marketPrices.colTrend')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {prices.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fbfbf9] transition">
                    <td className="py-3.5 px-4 font-bold text-[#06483d]">
                      {item.crop}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {item.variety}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      <span className="font-medium text-gray-900">{item.market_name}</span>
                      <span className="block text-[11px] text-gray-400">{item.district} Dist.</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-gray-600">
                      ₹{item.min_price.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-gray-600">
                      ₹{item.max_price.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-[#07503c] text-sm">
                      ₹{item.modal_price.toLocaleString()}
                      <span className="block text-[10px] text-gray-400 font-normal">/ Qtl</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {item.trend === 'up' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <TrendingUp className="w-3 h-3" /> {t('marketPrices.trendUp')}
                        </span>
                      )}
                      {item.trend === 'down' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                          <TrendingDown className="w-3 h-3" /> {t('marketPrices.trendDown')}
                        </span>
                      )}
                      {item.trend === 'stable' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                          <Minus className="w-3 h-3" /> {t('marketPrices.trendStable')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Advisory on Farm Gate Selling */}
        <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
          <p className="font-bold text-sm text-amber-950">{t('marketPrices.advisoryTitle')}</p>
          <p className="leading-relaxed">
            {t('marketPrices.advisoryDesc')}
          </p>
        </div>
      </div>
    </div>
  );
}
