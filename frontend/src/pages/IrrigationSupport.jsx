import React, { useState } from 'react';
import { Droplets, Waves, CheckCircle2, AlertTriangle, Calculator, ArrowRight, Phone, Send } from 'lucide-react';
import { submitComplaint } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function IrrigationSupport() {
  const { t, isTelugu } = useLanguage();

  // APMIP Subsidy Calculator State
  const [landArea, setLandArea] = useState(2.5);
  const [farmerCategory, setFarmerCategory] = useState('small');
  const [systemType, setSystemType] = useState('drip');

  // Water Complaint State
  const [farmerName, setFarmerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [village, setVillage] = useState('Prathuru');
  const [sourceType, setSourceType] = useState('Canal Distributary');
  const [issueDetails, setIssueDetails] = useState('');
  const [submittedId, setSubmittedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Cost estimates based on APMIP guidelines
  const baseCostPerAcre = systemType === 'drip' ? 38000 : 25000;
  const totalCost = Math.round(landArea * baseCostPerAcre);

  let subsidyRate = 0.70; // 70% default for small/marginal
  if (farmerCategory === 'sc_st') subsidyRate = 0.90;
  else if (farmerCategory === 'large') subsidyRate = 0.50;

  const estimatedSubsidy = Math.round(totalCost * subsidyRate);
  const farmerShare = totalCost - estimatedSubsidy;

  const handleWaterComplaint = async (e) => {
    e.preventDefault();
    if (!farmerName || !mobile || !issueDetails) {
      setErrorMsg(isTelugu ? 'దయచేసి అన్ని వివరాలను నమోదు చేయండి' : 'Please fill all required fields');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    try {
      const res = await submitComplaint({
        farmer_name: farmerName,
        mobile: mobile,
        village: village,
        crop_type: isTelugu ? 'వరి / ఉద్యానవన పంటలు' : 'Paddy / Horticultural Crops',
        problem_category: 'Irrigation',
        problem_title: `${isTelugu ? 'సాగునీటి కొరత హెచ్చరిక' : 'Water Scarcity Alert'} - ${sourceType} in ${village}`,
        description: `Source: ${sourceType}. Issue: ${issueDetails}`
      });

      setSubmittedId(res.complaint_id || 'RS-2026-IRR');
      setFarmerName('');
      setMobile('');
      setIssueDetails('');
    } catch (err) {
      setErrorMsg(isTelugu ? 'సమర్పించడం విఫలమైంది. ఇంటర్నెట్ తనిఖీ చేయండి.' : 'Submission failed. Please check internet connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fbfaf5] min-h-screen py-10 px-4 sm:px-[6%]">
      <div className="max-w-[1300px] mx-auto space-y-10">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#073e32] to-[#0b4b3d] text-white p-6 sm:p-8 rounded-2xl shadow-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-200 text-xs font-bold mb-3">
            <span>💧</span> {t('irrigation.badge')}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold mb-2">
            {t('irrigation.title')}
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed">
            {t('irrigation.desc')}
          </p>
        </div>

        {/* Irrigation Systems Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* System 1 */}
          <div className="bg-white p-6 rounded-2xl border border-[#e2e7e7] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-2xl mb-4">
                🌊
              </div>
              <h3 className="text-lg font-bold text-[#06483d] mb-1.5">
                {t('irrigation.canalTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                {t('irrigation.canalDesc')}
              </p>
              <ul className="text-xs text-gray-700 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('irrigation.canalPoint1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('irrigation.canalPoint2')}</span>
                </li>
              </ul>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100 text-xs text-blue-800 font-semibold">
              {t('irrigation.canalOffice')}
            </div>
          </div>

          {/* System 2 */}
          <div className="bg-white p-6 rounded-2xl border border-[#e2e7e7] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl mb-4">
                💧
              </div>
              <h3 className="text-lg font-bold text-[#06483d] mb-1.5">
                {t('irrigation.dripTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                {t('irrigation.dripDesc')}
              </p>
              <ul className="text-xs text-gray-700 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('irrigation.dripPoint1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('irrigation.dripPoint2')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('irrigation.dripPoint3')}</span>
                </li>
              </ul>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100 text-xs text-emerald-800 font-semibold">
              {t('irrigation.dripCrops')}
            </div>
          </div>

          {/* System 3 */}
          <div className="bg-white p-6 rounded-2xl border border-[#e2e7e7] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-2xl mb-4">
                🚿
              </div>
              <h3 className="text-lg font-bold text-[#06483d] mb-1.5">
                {t('irrigation.sprinklerTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                {t('irrigation.sprinklerDesc')}
              </p>
              <ul className="text-xs text-gray-700 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('irrigation.sprinklerPoint1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('irrigation.sprinklerPoint2')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('irrigation.sprinklerPoint3')}</span>
                </li>
              </ul>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100 text-xs text-amber-800 font-semibold">
              {t('irrigation.sprinklerCrops')}
            </div>
          </div>
        </div>

        {/* APMIP Subsidy Calculator & Water Complaint Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* APMIP Subsidy Calculator */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#e2e7e7] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <Calculator className="w-6 h-6 text-[#07503c]" />
              <div>
                <h3 className="text-lg font-bold text-[#06483d]">
                  {t('irrigation.calcTitle')}
                </h3>
                <p className="text-xs text-gray-500">
                  {t('irrigation.calcDesc')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t('irrigation.landAreaLabel')}
                </label>
                <input
                  type="number"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={landArea}
                  onChange={(e) => setLandArea(Number(e.target.value) || 1)}
                  className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t('irrigation.farmerCategoryLabel')}
                </label>
                <select
                  value={farmerCategory}
                  onChange={(e) => setFarmerCategory(e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                >
                  <option value="sc_st">{t('irrigation.scStCategory')}</option>
                  <option value="small">{t('irrigation.smallCategory')}</option>
                  <option value="large">{t('irrigation.largeCategory')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t('irrigation.techLabel')}
                </label>
                <select
                  value={systemType}
                  onChange={(e) => setSystemType(e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                >
                  <option value="drip">{t('irrigation.dripOpt')}</option>
                  <option value="sprinkler">{t('irrigation.sprinklerOpt')}</option>
                </select>
              </div>
            </div>

            {/* Calculated Breakdown Display */}
            <div className="bg-[#f8faf8] p-5 rounded-xl border border-[#dbe6df] space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{t('irrigation.totalEstimate')} ({landArea} {isTelugu ? 'ఎకరాలు' : 'Acres'}):</span>
                <span className="font-bold text-gray-900">₹{totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-emerald-700 font-semibold">{t('irrigation.subsidyAmount')} ({(subsidyRate * 100)}%):</span>
                <span className="font-extrabold text-emerald-700">- ₹{estimatedSubsidy.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-base">
                <span className="font-bold text-gray-900">{t('irrigation.farmerShare')}</span>
                <span className="font-extrabold text-2xl text-[#07503c]">₹{farmerShare.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 italic">
              {t('irrigation.calcNote')}
            </p>
          </div>

          {/* Direct Water Complaint Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#e2e7e7] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
              <Waves className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-[#06483d]">
                {t('irrigation.reportShortageTitle')}
              </h3>
            </div>

            {submittedId ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-3 animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900">{t('irrigation.reportLogged')}</h4>
                <p className="text-xs text-gray-600">
                  {t('irrigation.ticketAssigned')}
                </p>
                <div className="text-lg font-extrabold text-[#07503c] bg-white py-2 rounded-lg border border-emerald-300">
                  {submittedId}
                </div>
                <p className="text-xs text-gray-500">
                  {t('irrigation.forwardedNote')}
                </p>
                <button
                  onClick={() => setSubmittedId(null)}
                  className="text-xs text-[#07503c] font-bold underline"
                >
                  {t('irrigation.submitAnother')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleWaterComplaint} className="space-y-3.5">
                {errorMsg && (
                  <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t('irrigation.farmerName')}</label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="e.g., K. Venkata Rao"
                    className="w-full p-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t('irrigation.mobileNumber')}</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile number"
                    className="w-full p-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{t('irrigation.village')}</label>
                    <select
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full p-2.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                    >
                      <option value="Prathuru">{isTelugu ? 'ప్రాతూరు' : 'Prathuru'}</option>
                      <option value="Gundimeda">{isTelugu ? 'గుండిమెడ' : 'Gundimeda'}</option>
                      <option value="Tadepalli">{isTelugu ? 'తాడేపల్లి' : 'Tadepalli'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{t('irrigation.waterSource')}</label>
                    <select
                      value={sourceType}
                      onChange={(e) => setSourceType(e.target.value)}
                      className="w-full p-2.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                    >
                      <option value="Canal Distributary">{t('irrigation.sourceCanal')}</option>
                      <option value="Borewell / Electricity">{t('irrigation.sourceBorewell')}</option>
                      <option value="River Lift Pump">{t('irrigation.sourceLift')}</option>
                      <option value="Field Channel Silt">{t('irrigation.sourceSilt')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t('irrigation.problemDetails')}</label>
                  <textarea
                    required
                    rows={3}
                    value={issueDetails}
                    onChange={(e) => setIssueDetails(e.target.value)}
                    placeholder={t('irrigation.detailsPlaceholder')}
                    className="w-full p-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-[#07503c] hover:bg-[#06483d] text-white font-bold rounded-lg text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow transition disabled:opacity-70"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? t('common.searching') : t('irrigation.submitShortageBtn')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
