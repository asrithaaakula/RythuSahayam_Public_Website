import React, { useState } from 'react';
import { Sprout, CheckCircle2, MapPin, Users, HeartHandshake, Shield, Phone, Mail, Award, Send } from 'lucide-react';
import { submitFeedback } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackMobile, setFeedbackMobile] = useState('');
  const [feedbackVillage, setFeedbackVillage] = useState('Prathuru');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackName || !feedbackMsg) return;
    setSubmitting(true);
    try {
      await submitFeedback({
        name: feedbackName,
        mobile: feedbackMobile,
        village: feedbackVillage,
        message: feedbackMsg,
        rating: 5
      });
      setSubmitted(true);
      setFeedbackName('');
      setFeedbackMobile('');
      setFeedbackMsg('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fbfaf5] min-h-screen py-10 px-4 sm:px-[6%]">
      <div className="max-w-[1200px] mx-auto space-y-10">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#073e32] to-[#0b4b3d] text-white p-6 sm:p-10 rounded-2xl shadow-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-200 text-xs font-bold mb-3">
            <span>🌱</span> {t('about.badge')}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold mb-3">
            {t('about.title')}
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed">
            {t('about.desc')}
          </p>
        </div>

        {/* Mission & Key Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e2e7e7] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#e3f1e7] text-[#07503c] flex items-center justify-center text-2xl font-bold">
              🎯
            </div>
            <h3 className="text-lg font-bold text-[#06483d]">
              {t('about.missionTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {t('about.missionDesc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e2e7e7] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#e3f1e7] text-[#07503c] flex items-center justify-center text-2xl font-bold">
              📍
            </div>
            <h3 className="text-lg font-bold text-[#06483d]">
              {t('about.villagesTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {t('about.villagesDesc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e2e7e7] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#e3f1e7] text-[#07503c] flex items-center justify-center text-2xl font-bold">
              🤝
            </div>
            <h3 className="text-lg font-bold text-[#06483d]">
              {t('about.communityTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {t('about.communityDesc')}
            </p>
          </div>
        </div>

        {/* Detailed Context & Significance */}
        <div className="bg-white rounded-2xl border border-[#e2e7e7] p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#06483d]">
            {t('about.contextTitle')}
          </h2>

          <div className="prose text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4">
            <p>
              In Andhra Pradesh, agriculture serves as the primary backbone of rural livelihoods. In Tadepalli Mandal, particularly in the floodplains and canal reaches of Prathuru and Gundimeda, farmers cultivate high-value crops including Guntur Sannam/Teja Chilli, BPT 5204 Samba Masuri Paddy, Hybrid Cotton, and various horticultural vegetables.
            </p>
            <p>
              During primary field surveys in Prathuru and Gundimeda, several recurring operational bottlenecks were identified:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-800">
              <li><strong>Tail-end Canal Sluice Water Shortage:</strong> Lack of timely notification regarding Krishna Western Delta discharge timings.</li>
              <li><strong>Inadequate Mandi Transparency:</strong> Middlemen exploiting price variations between farm-gate collection and Guntur Agricultural Market Yard auctions.</li>
              <li><strong>Documentation Gaps in Welfare Schemes:</strong> Small and tenant farmers missing out on APMIP 90% micro-irrigation subsidies and PM-KISAN due to lack of document awareness.</li>
              <li><strong>Delayed Pest Diagnosis:</strong> Black Thrips in chilli and Fall Armyworm in maize spreading before chemical advisories reach farmers.</li>
            </ul>
            <p>
              <strong>RythuSahayam</strong> resolves these issues through a simple, responsive, mobile-first web architecture that functions without complex hurdles. Every submitted report generates a trackable ID connecting the farmer directly with local agricultural officers.
            </p>
          </div>
        </div>

        {/* Village Agricultural Hierarchy */}
        <div className="bg-white rounded-2xl border border-[#e2e7e7] p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-[#06483d] flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#07503c]" />
            {t('about.hierarchyTitle')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#f8faf8] p-4 rounded-xl border border-gray-200">
              <span className="font-bold text-[#07503c] block text-sm mb-1">{t('about.l1Title')}</span>
              <p className="font-semibold text-gray-800">{t('about.l1Role')}</p>
              <p className="text-gray-500 mt-0.5">{t('about.l1Office')}</p>
              <p className="text-gray-500 mt-1">{t('about.l1Desc')}</p>
            </div>
            <div className="bg-[#f8faf8] p-4 rounded-xl border border-gray-200">
              <span className="font-bold text-[#07503c] block text-sm mb-1">{t('about.l2Title')}</span>
              <p className="font-semibold text-gray-800">{t('about.l2Role')}</p>
              <p className="text-gray-500 mt-0.5">{t('about.l2Office')}</p>
              <p className="text-gray-500 mt-1">{t('about.l2Desc')}</p>
            </div>
            <div className="bg-[#f8faf8] p-4 rounded-xl border border-gray-200">
              <span className="font-bold text-[#07503c] block text-sm mb-1">{t('about.l3Title')}</span>
              <p className="font-semibold text-gray-800">{t('about.l3Role')}</p>
              <p className="text-gray-500 mt-0.5">{t('about.l3Office')}</p>
              <p className="text-gray-500 mt-1">{t('about.l3Desc')}</p>
            </div>
          </div>
        </div>

        {/* Feedback / Suggestions Form */}
        <div className="bg-white rounded-2xl border border-[#e2e7e7] p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-[#06483d] flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-[#07503c]" />
            {t('about.feedbackTitle')}
          </h3>
          <p className="text-xs text-gray-600">
            {t('about.feedbackDesc')}
          </p>

          {submitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold text-center">
              {t('about.feedbackSuccess')}
            </div>
          ) : (
            <form onSubmit={handleFeedback} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t('about.feedbackName')}</label>
                <input
                  type="text"
                  required
                  value={feedbackName}
                  onChange={(e) => setFeedbackName(e.target.value)}
                  placeholder="e.g. Subba Rao"
                  className="w-full p-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t('about.feedbackMobile')}</label>
                <input
                  type="tel"
                  value={feedbackMobile}
                  onChange={(e) => setFeedbackMobile(e.target.value)}
                  placeholder="Mobile number"
                  className="w-full p-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t('about.feedbackVillage')}</label>
                <select
                  value={feedbackVillage}
                  onChange={(e) => setFeedbackVillage(e.target.value)}
                  className="w-full p-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                >
                  <option value="Prathuru">{t('home.villagePrathuru') || 'Prathuru'}</option>
                  <option value="Gundimeda">{t('home.villageGundimeda') || 'Gundimeda'}</option>
                  <option value="Tadepalli">Tadepalli</option>
                </select>
              </div>
              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-gray-700 mb-1">{t('about.feedbackComment')}</label>
                <textarea
                  required
                  rows={3}
                  value={feedbackMsg}
                  onChange={(e) => setFeedbackMsg(e.target.value)}
                  placeholder="Share ideas on improving water distribution, pest alerts, or seed availability..."
                  className="w-full p-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                />
              </div>
              <div className="sm:col-span-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-2.5 px-6 bg-[#07503c] hover:bg-[#06483d] text-white font-bold rounded-lg text-xs sm:text-sm flex items-center gap-1.5 shadow transition"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending...' : t('about.submitFeedback')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
