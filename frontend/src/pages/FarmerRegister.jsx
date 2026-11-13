import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Sprout, Lock, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function FarmerRegister() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    full_name: '',
    mobile: '',
    email: '',
    village: 'Prathuru',
    district: 'Guntur',
    farming_category: 'Small/Marginal (< 2 ha)',
    land_area: '2.5',
    primary_crop: 'Paddy',
    password: '',
    confirm_password: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirm_password) {
      setErrorMsg('Passwords do not match');
      return;
    }
    if (formData.mobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);

    try {
      await register({
        full_name: formData.full_name,
        mobile: formData.mobile,
        email: formData.email || null,
        village: formData.village,
        district: formData.district,
        farming_category: formData.farming_category,
        land_area: parseFloat(formData.land_area) || 1.0,
        primary_crop: formData.primary_crop,
        password: formData.password
      });

      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fbfaf5] min-h-screen py-10 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-2xl border border-[#e2e7e7] p-7 sm:p-9 shadow-md space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#e3f1e7] text-2xl text-[#07503c] mb-2">
            🌱
          </div>
          <h1 className="text-2xl font-extrabold text-[#06483d]">
            {t('register.title')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {t('register.subtitle')}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t('register.fullName')}</label>
              <input
                type="text"
                required
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="e.g. Venkata Rami Reddy"
                className="w-full p-2.5 text-xs sm:text-sm border border-[#dce2e2] rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t('register.mobileNumber')}</label>
              <input
                type="tel"
                required
                maxLength={10}
                name="mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                placeholder="10-digit mobile"
                className="w-full p-2.5 text-xs sm:text-sm border border-[#dce2e2] rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none"
              />
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t('register.email')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="farmer@example.com"
                className="w-full p-2.5 text-xs sm:text-sm border border-[#dce2e2] rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none"
              />
            </div>

            {/* Village */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t('register.village')}</label>
              <select
                name="village"
                value={formData.village}
                onChange={handleChange}
                className="w-full p-2.5 text-xs sm:text-sm border border-[#dce2e2] rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none font-semibold"
              >
                <option value="Prathuru">{t('home.villagePrathuru') || 'Prathuru Village'}</option>
                <option value="Gundimeda">{t('home.villageGundimeda') || 'Gundimeda Village'}</option>
                <option value="Tadepalli">Tadepalli Rural</option>
              </select>
            </div>

            {/* Farming Category */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t('register.farmingCategory')}</label>
              <select
                name="farming_category"
                value={formData.farming_category}
                onChange={handleChange}
                className="w-full p-2.5 text-xs sm:text-sm border border-[#dce2e2] rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none"
              >
                <option>Small/Marginal (&lt; 2 ha)</option>
                <option>Medium (2-10 ha)</option>
                <option>Large (&gt; 10 ha)</option>
                <option>Tenant Farmer (CCRC)</option>
              </select>
            </div>

            {/* Land Area */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t('register.landArea')}</label>
              <input
                type="number"
                step="0.1"
                name="land_area"
                value={formData.land_area}
                onChange={handleChange}
                className="w-full p-2.5 text-xs sm:text-sm border border-[#dce2e2] rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none"
              />
            </div>

            {/* Primary Crop */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">{t('register.primaryCrop')}</label>
              <select
                name="primary_crop"
                value={formData.primary_crop}
                onChange={handleChange}
                className="w-full p-2.5 text-xs sm:text-sm border border-[#dce2e2] rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none"
              >
                <option value="Paddy">{t('home.cropPaddy') || 'Paddy'}</option>
                <option value="Chilli">{t('home.cropChilli') || 'Chilli'}</option>
                <option value="Cotton">{t('home.cropCotton') || 'Cotton'}</option>
                <option value="Maize">{t('home.cropMaize') || 'Maize'}</option>
                <option value="Vegetables">{t('home.cropVegetables') || 'Vegetables'}</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t('register.createPassword')}</label>
              <input
                type="password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full p-2.5 text-xs sm:text-sm border border-[#dce2e2] rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t('register.confirmPassword')}</label>
              <input
                type="password"
                required
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full p-2.5 text-xs sm:text-sm border border-[#dce2e2] rounded-xl focus:ring-2 focus:ring-[#07503c] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-[#07503c] hover:bg-[#06483d] text-white font-bold rounded-xl text-sm shadow transition disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{loading ? t('register.creating') : t('register.submitBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-600">
          <span>{t('register.alreadyRegistered')} </span>
          <Link to="/login" className="font-bold text-[#07503c] hover:underline">
            {t('register.signInHere')}
          </Link>
        </div>
      </div>
    </div>
  );
}
