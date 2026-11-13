import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Upload, FileText, Download, ArrowRight, ShieldAlert, Phone } from 'lucide-react';
import { submitComplaint } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function ReportProblem() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [farmerName, setFarmerName] = useState(user?.full_name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [village, setVillage] = useState(searchParams.get('village') || user?.village || 'Prathuru');
  const [cropType, setCropType] = useState(searchParams.get('crop') || user?.primary_crop || 'Paddy');
  const [problemCategory, setProblemCategory] = useState(searchParams.get('category') || 'Irrigation');
  const [problemTitle, setProblemTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    if (user) {
      if (!farmerName) setFarmerName(user.full_name);
      if (!mobile) setMobile(user.mobile);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!farmerName.trim() || !mobile.trim() || !problemTitle.trim() || !description.trim()) {
      setErrorMsg('Please complete all mandatory fields.');
      return;
    }

    if (mobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        farmer_name: farmerName.trim(),
        mobile: mobile.trim(),
        village: village,
        crop_type: cropType,
        problem_category: problemCategory,
        problem_title: problemTitle.trim(),
        description: description.trim(),
        image_url: imagePreview ? 'uploaded_field_photo.jpg' : null,
        user_id: user?.id || null
      };

      const res = await submitComplaint(payload);

      setSubmittedData({
        complaint_id: res.complaint_id,
        ...payload,
        created_at: new Date().toLocaleString()
      });
    } catch (err) {
      setErrorMsg(err.message || 'Submission failed. Please check internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!submittedData) return;
    const text = `==========================================================
RYTHUSAHAYAM - AGRICULTURAL COMPLAINT ACKNOWLEDGMENT
==========================================================
Ticket ID:        ${submittedData.complaint_id}
Date & Time:      ${submittedData.created_at}
Farmer Name:      ${submittedData.farmer_name}
Mobile Number:    ${submittedData.mobile}
Village:          ${submittedData.village}, Tadepalli Mandal
Crop:             ${submittedData.crop_type}
Category:         ${submittedData.problem_category}
Problem Subject:  ${submittedData.problem_title}

DESCRIPTION:
${submittedData.description}

FORWARDED TO:
Tadepalli Mandal Agriculture Office & Village Agriculture Assistant (VAA)
Prathuru / Gundimeda Rythu Seva Kendram

Track this ticket online anytime at:
https://rythusahayam.ap.gov.in/track-complaint?id=${submittedData.complaint_id}
==========================================================`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RythuSahayam_${submittedData.complaint_id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#fbfaf5] min-h-screen py-10 px-4 sm:px-[6%]">
      <div className="max-w-[1000px] mx-auto space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#073e32] to-[#0b4b3d] text-white p-6 sm:p-8 rounded-2xl shadow-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-200 text-xs font-bold mb-3">
            <span>📝</span> {t('reportProblem.badge')}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold mb-2">
            {t('reportProblem.title')}
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed">
            {t('reportProblem.desc')}
          </p>
        </div>

        {submittedData ? (
          /* ================= CONFIRMATION VIEW ================= */
          <div className="bg-white rounded-2xl border border-emerald-200 p-6 sm:p-10 shadow-lg text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-[#07503c] rounded-full flex items-center justify-center mx-auto text-3xl">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {t('reportProblem.ticketRegistered')}
              </span>
              <h2 className="text-2xl font-extrabold text-[#06483d] mt-3">
                {t('reportProblem.yourTicketId')} <span className="text-emerald-700">{submittedData.complaint_id}</span>
              </h2>
              <p className="text-sm text-gray-600 max-w-lg mx-auto mt-2">
                {t('reportProblem.forwardedTo')} <strong>{submittedData.village}</strong>.
              </p>
            </div>

            <div className="bg-[#f8faf8] p-5 rounded-xl border border-gray-200 text-left max-w-lg mx-auto text-xs sm:text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">{t('reportProblem.farmerName')}</span>
                <span className="font-bold text-gray-800">{submittedData.farmer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">{t('reportProblem.category')}</span>
                <span className="font-bold text-gray-800">{submittedData.problem_category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">{t('reportProblem.crop')}</span>
                <span className="font-bold text-gray-800">{submittedData.crop_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">{t('reportProblem.status')}</span>
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">{t('reportProblem.statusSubmittedPending')}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleDownloadReport}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#07503c] hover:bg-[#06483d] text-white font-bold rounded-xl text-sm shadow transition"
              >
                <Download className="w-4 h-4" />
                <span>{t('reportProblem.downloadReceipt')}</span>
              </button>

              <Link
                to={`/track-complaint?id=${submittedData.complaint_id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#eaf2e9] hover:bg-[#d9ead8] text-[#07503c] font-bold rounded-xl text-sm transition"
              >
                <span>{t('reportProblem.trackLive')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setSubmittedData(null);
                  setProblemTitle('');
                  setDescription('');
                  setImagePreview(null);
                }}
                className="text-xs text-gray-500 hover:text-gray-800 underline font-semibold"
              >
                {t('reportProblem.fileAnother')}
              </button>
            </div>
          </div>
        ) : (
          /* ================= COMPLAINT SUBMISSION FORM ================= */
          <div className="bg-white rounded-2xl border border-[#e2e7e7] p-6 sm:p-10 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Farmer Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    {t('reportProblem.fullName')}
                  </label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder={t('reportProblem.namePlaceholder')}
                    className="w-full p-3 text-sm bg-white border border-[#dce2e2] rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    {t('reportProblem.mobileNumber')}
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder={t('reportProblem.mobilePlaceholder')}
                    className="w-full p-3 text-sm bg-white border border-[#dce2e2] rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                  />
                </div>

                {/* Village */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    {t('reportProblem.village')}
                  </label>
                  <select
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full p-3 text-sm bg-white border border-[#dce2e2] rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                  >
                    <option value="Prathuru">{t('home.villagePrathuru') || 'Prathuru Village'}</option>
                    <option value="Gundimeda">{t('home.villageGundimeda') || 'Gundimeda Village'}</option>
                    <option value="Tadepalli">Tadepalli Rural</option>
                    <option value="Other">{t('home.categoryOther') || 'Other Surrounding Village'}</option>
                  </select>
                </div>

                {/* Crop Type */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    {t('reportProblem.affectedCrop')}
                  </label>
                  <select
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full p-3 text-sm bg-white border border-[#dce2e2] rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                  >
                    <option value="Paddy">{t('home.cropPaddy') || 'Paddy (వరి)'}</option>
                    <option value="Chilli">{t('home.cropChilli') || 'Chilli (మిరప)'}</option>
                    <option value="Cotton">{t('home.cropCotton') || 'Cotton (ప్రత్తి)'}</option>
                    <option value="Maize">{t('home.cropMaize') || 'Maize (మొక్కజొన్న)'}</option>
                    <option value="Vegetables">{t('home.cropVegetables') || 'Vegetables (కూరగాయలు)'}</option>
                    <option value="Other">{t('home.categoryOther') || 'Other / Fallow Land'}</option>
                  </select>
                </div>

                {/* Problem Category */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    {t('reportProblem.problemCategory')}
                  </label>
                  <select
                    value={problemCategory}
                    onChange={(e) => setProblemCategory(e.target.value)}
                    className="w-full p-3 text-sm bg-white border border-[#dce2e2] rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none font-semibold text-[#07503c]"
                  >
                    <option value="Irrigation">{t('home.categoryIrrigation') || 'Irrigation'}</option>
                    <option value="Electricity">{t('home.categoryElectricity') || 'Electricity'}</option>
                    <option value="Seeds and Fertilizers">{t('home.categorySeeds') || 'Seeds and Fertilizers'}</option>
                    <option value="Crop Diseases">{t('home.categoryDiseases') || 'Crop Diseases'}</option>
                    <option value="Pest Attacks">Pest Attacks</option>
                    <option value="Loans">{t('home.categoryLoans') || 'Crop Loans'}</option>
                    <option value="Crop Storage">{t('home.categoryStorage') || 'Crop Storage'}</option>
                    <option value="Transportation">{t('home.categoryTransport') || 'Transportation'}</option>
                    <option value="Market Prices">{t('home.categoryPrices') || 'Market Prices'}</option>
                    <option value="Other">{t('home.categoryOther') || 'Other'}</option>
                  </select>
                </div>

                {/* Problem Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    {t('reportProblem.problemTitle')}
                  </label>
                  <input
                    type="text"
                    required
                    value={problemTitle}
                    onChange={(e) => setProblemTitle(e.target.value)}
                    placeholder={t('reportProblem.titlePlaceholder')}
                    className="w-full p-3 text-sm bg-white border border-[#dce2e2] rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                  />
                </div>

                {/* Detailed Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    {t('reportProblem.detailedDesc')}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('reportProblem.descPlaceholder')}
                    className="w-full p-3 text-sm bg-white border border-[#dce2e2] rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none"
                  />
                </div>

                {/* Optional Photo Attachment */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    {t('reportProblem.attachPhoto')}
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-emerald-500 transition">
                    <input
                      type="file"
                      accept="image/*"
                      id="crop-photo"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label htmlFor="crop-photo" className="cursor-pointer flex flex-col items-center justify-center gap-1.5">
                      <Upload className="w-6 h-6 text-gray-400" />
                      <span className="text-xs font-semibold text-[#07503c]">
                        {t('reportProblem.photoUploadPrompt')}
                      </span>
                      <span className="text-[11px] text-gray-400">{t('reportProblem.photoFormats')}</span>
                    </label>

                    {imagePreview && (
                      <div className="mt-3 inline-block relative">
                        <img
                          src={imagePreview}
                          alt="Field preview"
                          className="w-32 h-24 object-cover rounded-lg border border-emerald-300"
                        />
                        <button
                          type="button"
                          onClick={() => { setImageFile(null); setImagePreview(null); }}
                          className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-[#07503c] hover:bg-[#06483d] text-white font-extrabold rounded-xl text-sm sm:text-base shadow-md transition hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  <FileText className="w-5 h-5" />
                  <span>{loading ? t('reportProblem.submitting') : t('reportProblem.submitComplaintBtn')}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span>{t('reportProblem.directDispatch')}</span>
                <Link to="/track-complaint" className="text-[#07503c] font-bold hover:underline">
                  {t('reportProblem.haveId')}
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
