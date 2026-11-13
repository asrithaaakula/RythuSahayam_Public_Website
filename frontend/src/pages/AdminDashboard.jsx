import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Users, FileText, CheckCircle2, Clock, AlertTriangle, Search, Filter, MessageSquare, Plus, Bell, RefreshCw, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { fetchAdminStats, fetchAdminFarmers, fetchComplaints, updateComplaintStatus } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const COLORS = ['#07503c', '#2563eb', '#d97706', '#dc2626', '#8b5cf6', '#059669'];

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { user, isAdmin, login, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Admin Login State for non-logged in users
  const [adminEmail, setAdminEmail] = useState('admin@rythusahayam.ap.gov.in');
  const [adminPass, setAdminPass] = useState('Admin@12345');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard Data State
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [activeTab, setActiveTab] = useState('complaints'); // complaints, farmers, announcements
  const [loading, setLoading] = useState(false);

  // Complaint Filters
  const [filterVillage, setFilterVillage] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Complaint for Status Update
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminRemark, setAdminRemark] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin, filterVillage, filterStatus, searchQuery]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await fetchAdminStats();
      setStats(statsRes);

      const compRes = await fetchComplaints({
        village: filterVillage,
        status: filterStatus,
        search: searchQuery
      });
      setComplaints(compRes.complaints || []);

      const farmRes = await fetchAdminFarmers({ village: filterVillage });
      setFarmers(farmRes.farmers || []);
    } catch (err) {
      console.error("Admin data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const u = await login(adminEmail, adminPass);
      if (u.role !== 'admin') {
        setLoginError('Account is not authorized with Administrator permissions.');
      }
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!editingComplaint) return;
    setUpdateLoading(true);
    setUpdateMsg('');

    try {
      await updateComplaintStatus(editingComplaint.complaint_id, newStatus, adminRemark);
      setUpdateMsg('Complaint status updated successfully!');
      setTimeout(() => {
        setEditingComplaint(null);
        setUpdateMsg('');
        loadAdminData();
      }, 1200);
    } catch (err) {
      setUpdateMsg(err.message || 'Failed to update status.');
    } finally {
      setUpdateLoading(false);
    }
  };

  // If not admin, show inline secure Admin Login
  if (!authLoading && !isAdmin) {
    return (
      <div className="bg-[#fbfaf5] min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl border border-amber-200 p-8 shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto text-2xl">
              🛡️
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Agriculture Officer Portal
            </h1>
            <p className="text-xs text-gray-500">
              Administrator authentication required for Mandal &amp; Village grievance management.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 text-rose-800 text-xs font-semibold rounded-xl border border-rose-200">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Officer Email / Mobile</label>
              <input
                type="text"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-[#07503c] hover:bg-[#06483d] text-white font-bold rounded-xl text-sm shadow transition disabled:opacity-70"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In as Officer'}
            </button>
          </form>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
            <p className="font-bold">CSP Demonstration Credentials:</p>
            <p className="mt-0.5">admin@rythusahayam.ap.gov.in / Admin@12345</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fbfaf5] min-h-screen py-10 px-4 sm:px-[6%]">
      <div className="max-w-[1300px] mx-auto space-y-8">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-[#073e32] to-[#123b38] text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-200 text-xs font-bold mb-2">
              <Shield className="w-3.5 h-3.5" /> {t('admin.badge')}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t('admin.title')}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
              {t('admin.loggedInAs')} <strong>{user?.full_name}</strong> (Tadepalli Mandal)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAdminData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition border border-white/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t('admin.refreshData')}</span>
            </button>
            <Link
              to="/dashboard"
              className="px-3.5 py-2 bg-white text-[#07503c] rounded-xl text-xs font-bold shadow hover:bg-emerald-50 transition"
            >
              {t('admin.farmerView')}
            </Link>
          </div>
        </div>

        {/* KPI Metrics */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#e2e7e7] shadow-sm">
              <span className="text-xs font-semibold text-gray-500 block">{t('admin.registeredFarmers')}</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#06483d] mt-1.5">{stats.total_farmers}</p>
            </div>
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#e2e7e7] shadow-sm">
              <span className="text-xs font-semibold text-gray-500 block">{t('admin.totalComplaints')}</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1.5">{stats.total_complaints}</p>
            </div>
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#e2e7e7] shadow-sm">
              <span className="text-xs font-semibold text-amber-700 block">{t('admin.pendingReview')}</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1.5">{stats.pending_complaints}</p>
            </div>
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#e2e7e7] shadow-sm">
              <span className="text-xs font-semibold text-blue-700 block">{t('admin.underAction')}</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-1.5">{stats.in_progress_complaints}</p>
            </div>
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#e2e7e7] shadow-sm col-span-2 sm:col-span-1">
              <span className="text-xs font-semibold text-emerald-700 block">{t('admin.resolvedTickets')}</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1.5">{stats.resolved_complaints}</p>
            </div>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex border-b border-gray-200 gap-2">
          <button
            onClick={() => setActiveTab('complaints')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
              activeTab === 'complaints'
                ? 'border-[#07503c] text-[#07503c]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t('admin.tabComplaints')} ({complaints.length})
          </button>
          <button
            onClick={() => setActiveTab('farmers')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
              activeTab === 'farmers'
                ? 'border-[#07503c] text-[#07503c]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t('admin.tabFarmers')} ({farmers.length})
          </button>
        </div>

        {/* Tab 1: Complaint Management */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            {/* Filter Controls */}
            <div className="bg-white p-4 rounded-xl border border-[#e2e7e7] shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('admin.searchPlaceholder')}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                />
              </div>

              <div>
                <select
                  value={filterVillage}
                  onChange={(e) => setFilterVillage(e.target.value)}
                  className="w-full p-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                >
                  <option value="All">{t('admin.allVillages')}</option>
                  <option value="Prathuru">{t('home.villagePrathuru') || 'Prathuru'}</option>
                  <option value="Gundimeda">{t('home.villageGundimeda') || 'Gundimeda'}</option>
                  <option value="Tadepalli">Tadepalli</option>
                </select>
              </div>

              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                >
                  <option value="All">{t('admin.allStatuses')}</option>
                  <option value="Submitted">{t('trackComplaint.stepSubmitted')}</option>
                  <option value="Under Review">{t('trackComplaint.stepReview')}</option>
                  <option value="In Progress">{t('trackComplaint.stepProgress')}</option>
                  <option value="Resolved">{t('trackComplaint.stepResolved')}</option>
                </select>
              </div>
            </div>

            {/* Complaints Table */}
            <div className="bg-white rounded-2xl border border-[#e2e7e7] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#f6f9f7] text-[#07503c] uppercase text-[11px] font-bold border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">{t('dashboard.colTicket')}</th>
                      <th className="py-3 px-4">{t('trackComplaint.farmerName')}</th>
                      <th className="py-3 px-4">{t('trackComplaint.village')}</th>
                      <th className="py-3 px-4">{t('dashboard.colCategory')} &amp; {t('dashboard.colSubject')}</th>
                      <th className="py-3 px-4">{t('dashboard.colStatus')}</th>
                      <th className="py-3 px-4 text-right">{t('dashboard.colAction')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {complaints.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          No complaints matching the selected filters.
                        </td>
                      </tr>
                    ) : (
                      complaints.map((c) => (
                        <tr key={c.id} className="hover:bg-[#fbfbf9] transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#07503c]">
                            {c.complaint_id}
                            <span className="block text-[10px] text-gray-400 font-normal">{c.created_at}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-gray-900 block">{c.farmer_name}</span>
                            <span className="text-[11px] text-gray-500 font-mono">📞 {c.mobile}</span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-gray-800">
                            {c.village}
                          </td>
                          <td className="py-3.5 px-4 max-w-[220px]">
                            <span className="text-[10px] font-bold uppercase text-[#07503c] bg-[#eaf2e9] px-2 py-0.5 rounded-full">
                              {c.problem_category}
                            </span>
                            <p className="font-semibold text-gray-900 mt-1 truncate">{c.problem_title}</p>
                            <p className="text-[11px] text-gray-500 line-clamp-1">{c.description}</p>
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
                            <button
                              onClick={() => {
                                setEditingComplaint(c);
                                setNewStatus(c.status);
                                setAdminRemark(c.admin_remarks || '');
                              }}
                              className="px-3 py-1.5 bg-[#07503c] hover:bg-[#06483d] text-white text-xs font-bold rounded-lg transition shadow-sm"
                            >
                              {t('admin.updateStatusBtn')}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Registered Farmers */}
        {activeTab === 'farmers' && (
          <div className="bg-white rounded-2xl border border-[#e2e7e7] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-[#06483d]">
                {t('admin.registeredFarmers')}
              </h3>
              <span className="text-xs text-gray-500">Prathuru &amp; Gundimeda Mandal Database</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#f6f9f7] text-[#07503c] uppercase text-[11px] font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">{t('trackComplaint.farmerName')}</th>
                    <th className="py-3 px-4">{t('register.mobileNumber')}</th>
                    <th className="py-3 px-4">{t('trackComplaint.village')}</th>
                    <th className="py-3 px-4">{t('register.landArea')}</th>
                    <th className="py-3 px-4">{t('register.primaryCrop')}</th>
                    <th className="py-3 px-4">{t('register.farmingCategory')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {farmers.map((f) => (
                    <tr key={f.id} className="hover:bg-[#fbfbf9] transition">
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {f.full_name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-600">
                        {f.mobile}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-800">
                        {f.village}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#07503c]">
                        {f.land_area} Acres
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-800">
                        {f.primary_crop}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-500">
                        {f.farming_category}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= STATUS UPDATE MODAL ================= */}
        {editingComplaint && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-extrabold text-lg text-[#06483d]">
                    {t('admin.modalTitle')} #{editingComplaint.complaint_id}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Farmer: {editingComplaint.farmer_name} • {editingComplaint.village}
                  </p>
                </div>
                <button
                  onClick={() => setEditingComplaint(null)}
                  className="text-gray-400 hover:text-gray-700 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {updateMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
                  {updateMsg}
                </div>
              )}

              <form onSubmit={handleStatusUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {t('admin.modalStatusLabel')}
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full p-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none font-bold text-[#07503c]"
                  >
                    <option value="Submitted">Submitted (Logged)</option>
                    <option value="Under Review">Under Review (Assigned to Officer)</option>
                    <option value="In Progress">In Progress (Field Action / Dispatched)</option>
                    <option value="Resolved">Resolved (Inspection Complete &amp; Closed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {t('admin.modalRemarksLabel')}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={adminRemark}
                    onChange={(e) => setAdminRemark(e.target.value)}
                    placeholder="Provide specific notes: e.g. VAA visited farm, ordered silt clearance, or prescribed chemical dosage..."
                    className="w-full p-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                  />
                  <span className="text-[11px] text-gray-400 block mt-1">
                    {t('admin.modalRemarkHelp')}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingComplaint(null)}
                    className="flex-1 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                  >
                    {t('common.cancel') || 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="flex-1 py-2.5 text-xs font-bold text-white bg-[#07503c] hover:bg-[#06483d] rounded-xl shadow transition disabled:opacity-70"
                  >
                    {updateLoading ? 'Saving...' : t('admin.saveBtn')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
