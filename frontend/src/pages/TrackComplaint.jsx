import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, CheckCircle2, Clock, AlertTriangle, ArrowRight, User, MapPin, Calendar, Shield } from 'lucide-react';
import { fetchComplaintTracking } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function TrackComplaint() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [ticketInput, setTicketInput] = useState(searchParams.get('id') || '');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      setTicketInput(idFromUrl);
      searchTicket(idFromUrl);
    }
  }, [searchParams]);

  const searchTicket = async (id) => {
    if (!id || !id.trim()) {
      setErrorMsg('Please enter a Complaint ID');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetchComplaintTracking(id.trim());
      setComplaint(res.complaint);
    } catch (err) {
      setComplaint(null);
      setErrorMsg(err.message || 'Complaint not found. Please verify your Ticket ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchTicket(ticketInput);
  };

  const stepKeys = [
    { key: 'Submitted', label: t('trackComplaint.stepSubmitted') },
    { key: 'Under Review', label: t('trackComplaint.stepReview') },
    { key: 'In Progress', label: t('trackComplaint.stepProgress') },
    { key: 'Resolved', label: t('trackComplaint.stepResolved') }
  ];

  const getStepIndex = (status) => {
    const idx = stepKeys.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  const getStatusLabel = (status) => {
    const step = stepKeys.find((s) => s.key === status);
    return step ? step.label : status;
  };

  return (
    <div className="bg-[#fbfaf5] min-h-screen py-10 px-4 sm:px-[6%]">
      <div className="max-w-[1000px] mx-auto space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#073e32] to-[#0b4b3d] text-white p-6 sm:p-8 rounded-2xl shadow-md text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-200 text-xs font-bold mb-3">
            <span>🔍</span> {t('trackComplaint.badge')}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold mb-2">
            {t('trackComplaint.title')}
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 max-w-xl mx-auto leading-relaxed">
            {t('trackComplaint.desc')}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-6 max-w-lg mx-auto flex gap-2">
            <input
              type="text"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder={t('trackComplaint.inputPlaceholder')}
              className="flex-1 px-4 py-3 bg-white text-gray-900 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-bold tracking-wider"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm shadow transition disabled:opacity-70 flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? t('trackComplaint.searching') : t('trackComplaint.trackBtn')}</span>
            </button>
          </form>

          {/* Sample quick buttons for user test */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-emerald-100/80">
            <span>{t('trackComplaint.trySamples')}</span>
            {['RS-2026-1001', 'RS-2026-1002', 'RS-2026-1003'].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setTicketInput(sample);
                  searchTicket(sample);
                }}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-emerald-100 font-semibold border border-white/20 transition"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Complaint Details View */}
        {complaint && (
          <div className="bg-white rounded-2xl border border-[#e2e7e7] p-6 sm:p-8 shadow-sm space-y-8 animate-fadeIn">
            {/* Header with Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {t('trackComplaint.recordTitle')}
                </span>
                <h2 className="text-2xl font-extrabold text-[#06483d] mt-0.5">
                  {t('trackComplaint.ticketNumber')}{complaint.complaint_id}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {t('trackComplaint.submittedOn')} {complaint.created_at} • {t('trackComplaint.lastUpdated')} {complaint.updated_at}
                </p>
              </div>

              <div className="self-start sm:self-auto">
                <span
                  className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    complaint.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : complaint.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : complaint.status === 'Under Review'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-gray-100 text-gray-800 border border-gray-300'
                  }`}
                >
                  ● {getStatusLabel(complaint.status)}
                </span>
              </div>
            </div>

            {/* Visual Progress Stepper */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
                {t('trackComplaint.progressTimeline')}
              </h3>
              <div className="grid grid-cols-4 gap-2 relative">
                {stepKeys.map((stepObj, i) => {
                  const currentIdx = getStepIndex(complaint.status);
                  const isCompleted = i <= currentIdx;
                  const isCurrent = i === currentIdx;

                  return (
                    <div key={stepObj.key} className="text-center relative">
                      <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full mx-auto flex items-center justify-center font-bold text-xs sm:text-sm mb-2 transition-all ${
                          isCompleted
                            ? 'bg-[#07503c] text-white shadow-md'
                            : 'bg-gray-100 text-gray-400 border border-gray-200'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                      </div>
                      <span
                        className={`block text-[11px] sm:text-xs font-semibold ${
                          isCurrent
                            ? 'text-[#07503c] font-bold'
                            : isCompleted
                            ? 'text-gray-800'
                            : 'text-gray-400'
                        }`}
                      >
                        {stepObj.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Problem Overview Card */}
            <div className="bg-[#f8faf8] p-5 sm:p-6 rounded-xl border border-gray-200 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 block">{t('trackComplaint.farmerName')}</span>
                  <span className="font-bold text-gray-900 text-sm">{complaint.farmer_name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">{t('trackComplaint.village')}</span>
                  <span className="font-bold text-gray-900 text-sm">{complaint.village}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">{t('trackComplaint.cropType')}</span>
                  <span className="font-bold text-gray-900 text-sm">{complaint.crop_type}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">{t('trackComplaint.category')}</span>
                  <span className="font-bold text-[#07503c] text-sm">{complaint.problem_category}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-500 block">{t('trackComplaint.subject')}</span>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{complaint.problem_title}</p>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mt-1">
                  {complaint.description}
                </p>
              </div>

              {/* Administrative Remarks */}
              {complaint.admin_remarks && (
                <div className="pt-3 border-t border-emerald-200/60 bg-emerald-50/70 p-4 rounded-lg">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-700" />
                    {t('trackComplaint.adminRemarks')}
                  </span>
                  <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
                    {complaint.admin_remarks}
                  </p>
                </div>
              )}
            </div>

            {/* Action History Log */}
            {complaint.timeline && complaint.timeline.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-[#06483d] mb-3">
                  {t('trackComplaint.actionHistory')}
                </h3>
                <div className="border-l-2 border-emerald-300 pl-4 space-y-4 ml-2">
                  {complaint.timeline.map((event) => (
                    <div key={event.id} className="relative text-xs">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#07503c]"></div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{getStatusLabel(event.status)}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{event.created_at}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-emerald-700 font-semibold">{event.updated_by}</span>
                      </div>
                      <p className="text-gray-700 mt-0.5">{event.remark}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
