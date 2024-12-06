import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Bath, LayoutDashboard, CalendarCheck, Wallet, QrCode, LogOut, Euro, Settings, Home } from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { Reservations } from './Reservations';
import { Wallet as WalletComponent } from './Wallet';
import { QrScanner } from './QrScanner';
import { PriceManagement } from './PriceManagement';
import { FeatureManagement } from './FeatureManagement';

export const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle logout logic here
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r">
          <div className="flex items-center h-16 px-4 border-b">
            <Bath className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold">ToiletPass Admin</span>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link to="/" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Home className="h-5 w-5 mr-3" />
              Retour à l'accueil
            </Link>
            <Link to="/admin" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
            <Link to="/admin/reservations" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <CalendarCheck className="h-5 w-5 mr-3" />
              Réservations
            </Link>
            <Link to="/admin/prices" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Euro className="h-5 w-5 mr-3" />
              Gestion des prix
            </Link>
            <Link to="/admin/features" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Settings className="h-5 w-5 mr-3" />
              Équipements
            </Link>
            <Link to="/admin/wallet" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Wallet className="h-5 w-5 mr-3" />
              Cagnotte
            </Link>
            <Link to="/admin/qr-scanner" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <QrCode className="h-5 w-5 mr-3" />
              Scanner QR
            </Link>
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/prices" element={<PriceManagement />} />
            <Route path="/features" element={<FeatureManagement />} />
            <Route path="/wallet" element={<WalletComponent />} />
            <Route path="/qr-scanner" element={<QrScanner />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};