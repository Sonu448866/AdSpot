import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SavedProvider } from './context/SavedContext';
import { NotificationProvider } from './context/NotificationContext';

// Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/auth/AuthModal';

// Pages
import { Home } from './pages/Home';
import { ExploreAds } from './pages/ExploreAds';
import { ListingDetail } from './pages/ListingDetail';
import { InteractiveMaps } from './pages/InteractiveMaps';
import { SavedOrders } from './pages/SavedOrders';
import { Profile } from './pages/Profile';
import { ListYourSpace } from './pages/ListYourSpace';
import { AdminPortal } from './pages/AdminPortal';
import { AdminLogin } from './pages/AdminLogin';
import { FAQs } from './pages/FAQs';
import { ContactUs } from './pages/ContactUs';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout wrapper to conditionally hide public Navbar and Footer on hidden admin routes
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && <Footer />}
      <AuthModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SavedProvider>
        <NotificationProvider>
          <Router>
            <ScrollToTop />
            <AppLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<ExploreAds />} />
                <Route path="/explore/:id" element={<ListingDetail />} />
                <Route path="/maps" element={<InteractiveMaps />} />
                <Route path="/saved-orders" element={<SavedOrders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/list-your-space" element={<ListYourSpace />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsConditions />} />

                {/* Hidden Administrative Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminPortal />} />

                {/* Fallback redirect */}
                <Route path="*" element={<Home />} />
              </Routes>
            </AppLayout>
          </Router>
        </NotificationProvider>
      </SavedProvider>
    </AuthProvider>
  );
};

export default App;
