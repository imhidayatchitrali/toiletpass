import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { BookingMap } from './components/BookingMap';
import { EstablishmentSection } from './components/EstablishmentSection';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { UserLogin } from './components/auth/UserLogin';
import { PartnerLogin } from './components/auth/PartnerLogin';
import { UserProfile } from './components/user/UserProfile';
import { UserReservations } from './components/user/UserReservations';
import { UserWallet } from './components/user/UserWallet';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { Terms } from './components/legal/Terms';
import { Legal } from './components/legal/Legal';
import { ErrorPage } from './components/ErrorPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/partner-login" element={<PartnerLogin />} />
          <Route path="/profile" element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          } />
          <Route path="/wallet" element={
            <PrivateRoute>
              <UserWallet />
            </PrivateRoute>
          } />
          <Route path="/reservations" element={
            <PrivateRoute>
              <UserReservations />
            </PrivateRoute>
          } />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/" element={
            <>
              <Header />
              <Hero />
              <About />
              <BookingMap />
              <EstablishmentSection />
              <Contact />
              <Footer />
            </>
          } />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;