import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, FileText, CheckCircle2, Clock, AlertCircle, PlusCircle, ArrowRight, Bell, Sprout, Droplets, IndianRupee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserComplaints, fetchAnnouncements } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function FarmerDashboard() {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    async function loadDashboard() {
      if (user) {
        setLoading(true);
        try {
          const cRes = await fetchUserComplaints();
          setComplaints(cRes.complaints || []);

          const aRes = await fetchAnnouncements();
          setAnnouncements(aRes.announcements || []);
        } catch (err) {
          console.error("Dashboard error:", err);
        } finally {
          setLoading(false);
        }
      }
    }
    loadDashboard();
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#07503c] font-bold">
        Verifying farmer session...
      </div>
    );
  }

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Submitted' || c.status === 'Under Review').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="bg-[#fbfaf5] min-h-screen py-10 px-4 sm:px-[6%]">
      <div className="max-w-[1300px] mx-auto space-y-8">
        {/* Welcome Profile Card */}
        <div className="bg-gradient-to-r from-[#073e32] to-[#0b4b3d] text-white p-6 sm:p-8 rounded-2xl shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white border border-white/30">
                {user.full_name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                    {t('dashboard.namaskaram')}, {user.full_name}
                  </h1>
                  <span className="text-xs bg-emerald-500/30 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                    {user.village}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
                  {t('dashboard.primaryCrop')} <strong>{user.primary_crop}</strong> • {t('dashboard.land')} <strong>{user.land_area} Acres</strong> • {t('dashboard.category')} <strong>{user.farming_category}</strong>
                </p>
              </div>
            </div>

            <Link
              to="/report-problem"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#07503c] font-bold rounded-xl text-xs sm:text-sm shadow hover:bg-emerald-50 transition self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('dashboard.reportNewProblem')}</span>
            </Link>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#e2e7e7] shadow-sm">
            <span className="text-xs font-semibold text-gray-500 block">{t('dashboard.totalComplaints')}</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#06483d]">{total}</span>
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#e2e7e7] shadow-sm">
            <span className="text-xs font-semibold text-amber-700 block">{t('dashboard.pendingReview')}</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">{pending}</span>
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#e2e7e7] shadow-sm">
            <span className="text-xs font-semibold text-blue-700 block">{t('dashboard.inProgress')}</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-600">{inProgress}</span>
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#e2e7e7] shadow-sm">
            <span className="text-xs font-semibold text-emerald-700 block">{t('dashboard.resolved')}</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{resolved}</span>
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Complaints Table & Announcements Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Complaints Table */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-[#e2e7e7] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#06483d]">
                  {t('dashboard.myComplaintsTitle')}
                </h3>
                <p className="text-xs text-gray-500">{t('dashboard.myComplaintsSub')}</p>
              </div>
              <Link to="/report-problem" className="text-xs font-bold text-[#07503c] hover:underline">
                {t('dashboard.newReportLink')}
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-gray-500">{t('common.loading')}</div>
            ) : complaints.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <p className="text-sm text-gray-600">{t('dashboard.noComplaints')}</p>
                <Link
                  to="/report-problem"
                  className="inline-block px-4 py-2 bg-[#07503c] text-white text-xs font-bold rounded-lg shadow"
                >
                  {t('dashboard.reportFirst')}
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#f6f9f7] text-[#07503c] uppercase text-[11px] font-bold border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">{t('dashboard.colTicket')}</th>
                      <th className="py-3 px-4">{t('dashboard.colSubject')}</th>
                      <th className="py-3 px-4">{t('dashboard.colCategory')}</th>
                      <th className="py-3 px-4">{t('dashboard.colStatus')}</th>
                      <th className="py-3 px-4 text-right">{t('dashboard.colAction')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {complaints.map((c) => (
                      <tr key={c.id} className="hover:bg-[#fbfbf9] transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#07503c]">
                          {c.complaint_id}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-gray-900 max-w-[200px] truncate">
                          {c.problem_title}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">
                          {c.problem_category}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              c.status === 'Resolved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : c.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            to={`/track-complaint?id=${c.complaint_id}`}
                            className="text-xs font-bold text-[#07503c] hover:underline inline-flex items-center gap-1"
                          >
                            <span>Timeline</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Announcements & Quick Actions */}
          <div className="lg:col-span-4 space-y-6">
            {/* Announcements */}
            <div className="bg-white rounded-2xl border border-[#e2e7e7] p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Bell className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-sm text-[#06483d]">
                  {t('dashboard.advisoriesTitle')}
                </h3>
              </div>

              <div className="space-y-3">
                {announcements.map((a) => (
                  <div key={a.id} className="p-3 rounded-xl bg-[#f8faf8] border border-gray-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#07503c]">{a.title}</span>
                      {a.is_urgent && (
                        <span className="text-[10px] bg-rose-100 text-rose-700 font-extrabold px-1.5 py-0.5 rounded">
                          {t('dashboard.urgent')}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 leading-relaxed">{a.content}</p>
                    <span className="text-[10px] text-gray-400 block pt-1">{a.published_at}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tools */}
            <div className="bg-[#f2f4e9] rounded-2xl p-5 border border-[#e1e6d5] space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#07503c]">
                {t('dashboard.quickToolsTitle')}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  to="/crop-guidance"
                  className="p-3 bg-white rounded-xl font-bold text-[#07503c] flex flex-col items-center justify-center gap-1 shadow-sm hover:bg-emerald-50 transition"
                >
                  <Sprout className="w-5 h-5" />
                  <span>{t('dashboard.toolCropGuide')}</span>
                </Link>
                <Link
                  to="/irrigation"
                  className="p-3 bg-white rounded-xl font-bold text-[#07503c] flex flex-col items-center justify-center gap-1 shadow-sm hover:bg-emerald-50 transition"
                >
                  <Droplets className="w-5 h-5" />
                  <span>{t('dashboard.toolWaterCalc')}</span>
                </Link>
                <Link
                  to="/market-prices"
                  className="p-3 bg-white rounded-xl font-bold text-[#07503c] flex flex-col items-center justify-center gap-1 shadow-sm hover:bg-emerald-50 transition"
                >
                  <IndianRupee className="w-5 h-5" />
                  <span>{t('dashboard.toolMandiRates')}</span>
                </Link>
                <Link
                  to="/schemes"
                  className="p-3 bg-white rounded-xl font-bold text-[#07503c] flex flex-col items-center justify-center gap-1 shadow-sm hover:bg-emerald-50 transition"
                >
                  <span>🏛️</span>
                  <span>{t('dashboard.toolSchemes')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
