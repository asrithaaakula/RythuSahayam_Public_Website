import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import CropGuidance from './pages/CropGuidance';
import IrrigationSupport from './pages/IrrigationSupport';
import SchemesLoans from './pages/SchemesLoans';
import MarketPrices from './pages/MarketPrices';
import ReportProblem from './pages/ReportProblem';
import TrackComplaint from './pages/TrackComplaint';
import FarmerLogin from './pages/FarmerLogin';
import FarmerRegister from './pages/FarmerRegister';
import FarmerDashboard from './pages/FarmerDashboard';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/crop-guidance" element={<CropGuidance />} />
                <Route path="/irrigation" element={<IrrigationSupport />} />
                <Route path="/schemes" element={<SchemesLoans />} />
                <Route path="/market-prices" element={<MarketPrices />} />
                <Route path="/report-problem" element={<ReportProblem />} />
                <Route path="/track-complaint" element={<TrackComplaint />} />
                <Route path="/login" element={<FarmerLogin />} />
                <Route path="/register" element={<FarmerRegister />} />
                <Route path="/dashboard" element={<FarmerDashboard />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
