import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ExternalLink, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#073e32] text-white pt-12 pb-8 border-t border-emerald-900/40">
      <div className="max-w-[1300px] mx-auto px-4 md:px-[6%]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand & Purpose */}
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold text-white mb-3">
              <span>🌿</span>
              <span>RythuSahayam</span>
            </div>
            <p className="text-emerald-100/80 text-sm leading-relaxed mb-4">
              {t('footerDesc')}
            </p>
            <div className="text-xs text-emerald-200/90 bg-emerald-950/60 p-3 rounded-lg border border-emerald-800/40">
              <span className="font-semibold block mb-0.5">{t('footerMotto')}</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300 mb-4">{t('footerQuickNav')}</h4>
            <ul className="space-y-2 text-sm text-emerald-100/80">
              <li><Link to="/" className="hover:text-white transition">{t('navHome')}</Link></li>
              <li><Link to="/crop-guidance" className="hover:text-white transition">{t('navCropGuidance')}</Link></li>
              <li><Link to="/irrigation" className="hover:text-white transition">{t('navIrrigation')}</Link></li>
              <li><Link to="/schemes" className="hover:text-white transition">{t('navSchemes')}</Link></li>
              <li><Link to="/market-prices" className="hover:text-white transition">{t('navMarketPrices')}</Link></li>
              <li><Link to="/report-problem" className="hover:text-white transition">{t('navReportProblem')}</Link></li>
              <li><Link to="/track-complaint" className="hover:text-white transition">{t('navTrackStatus')}</Link></li>
            </ul>
          </div>

          {/* Local Assistance Offices */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300 mb-4">{t('footerVillageCenters')}</h4>
            <div className="space-y-3 text-xs text-emerald-100/80">
              <div>
                <p className="font-semibold text-white">{t('footerPrathuruRsk')}</p>
                <p className="flex items-center gap-1.5 mt-0.5"><MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" /> Near Gram Panchayat, Prathuru</p>
                <p className="flex items-center gap-1.5 mt-0.5"><Phone className="w-3.5 h-3.5 text-emerald-300 shrink-0" /> VAA: +91 94409 01234</p>
              </div>
              <div className="pt-2 border-t border-emerald-900/60">
                <p className="font-semibold text-white">{t('footerGundimedaRsk')}</p>
                <p className="flex items-center gap-1.5 mt-0.5"><MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" /> Opp. Primary School, Gundimeda</p>
                <p className="flex items-center gap-1.5 mt-0.5"><Phone className="w-3.5 h-3.5 text-emerald-300 shrink-0" /> VAA: +91 94409 05678</p>
              </div>
              <div className="pt-2 border-t border-emerald-900/60">
                <p className="font-semibold text-white">{t('footerMandalOffice')}</p>
                <p className="flex items-center gap-1.5 mt-0.5"><MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" /> MPDO Office Complex, Tadepalli</p>
                <p className="flex items-center gap-1.5 mt-0.5"><Phone className="w-3.5 h-3.5 text-emerald-300 shrink-0" /> Helpline: 1800-180-1551</p>
              </div>
            </div>
          </div>

          {/* Official Portals & Project Note */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300 mb-4">Official Portals</h4>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li>
                <a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-white group">
                  <span>PM-KISAN Samman Nidhi</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition" />
                </a>
              </li>
              <li>
                <a href="https://ysrrythubharosa.ap.gov.in" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-white group">
                  <span>AP Rythu Bharosa Portal</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition" />
                </a>
              </li>
              <li>
                <a href="https://agmarknet.gov.in" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-white group">
                  <span>AGMARKNET Mandi Rates</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition" />
                </a>
              </li>
              <li>
                <a href="https://apagrisnet.gov.in" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-white group">
                  <span>AP Agrisnet Services</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition" />
                </a>
              </li>
              <li>
                <a href="https://soilhealth.dac.gov.in" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-white group">
                  <span>Soil Health Card Portal</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition" />
                </a>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-emerald-900/60">
              <Link to="/about" className="text-xs text-emerald-300 hover:text-emerald-100 underline block mb-2">
                Community Service Project (CSP) Documentation
              </Link>
              <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-emerald-200/80 hover:text-white bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800/40">
                <Shield className="w-3 h-3 text-amber-400" /> Administrative Access
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-900/70 pt-6 text-center text-xs text-emerald-200/70 space-y-1">
          <p className="font-medium text-emerald-100">
            RythuSahayam • Supporting Farmers in Prathuru &amp; Gundimeda • Tadepalli, Guntur District, AP
          </p>
          <p>
            Community Service Project &amp; Agricultural Welfare Support System • Built with React &amp; Flask
          </p>
        </div>
      </div>
    </footer>
  );
}
