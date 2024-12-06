import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, X, LogIn, User, LogOut, Building2, DoorClosed, History } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNavigation = (path: string) => {
    if (path.startsWith('#')) {
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
    setIsMenuOpen(false);
    setShowUserMenu(false);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { label: 'Accueil', path: '/' },
    { label: 'Réserver', path: '#booking' },
    { label: 'Devenir Partenaire', path: '#partner' },
    { label: 'Contact', path: '#contact' },
  ];

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group" onClick={() => setIsMenuOpen(false)}>
              <DoorClosed className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <span className="ml-2 text-xl font-bold text-gray-900 group-hover:text-gray-700">ToiletPass</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Mon Compte</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Mon Profil
                    </Link>
                    <Link
                      to="/reservations"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <History className="h-4 w-4 mr-2" />
                      Mes Réservations
                    </Link>
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      Espace Partenaire
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center"
                >
                  <LogIn className="h-5 w-5 mr-1" />
                  Connexion
                </Link>
                <Link 
                  to="/partner-login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Espace Partenaire
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5 inline mr-2" />
                  Mon Profil
                </Link>
                <Link
                  to="/reservations"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <History className="h-5 w-5 inline mr-2" />
                  Mes Réservations
                </Link>
                <Link
                  to="/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Building2 className="h-5 w-5 inline mr-2" />
                  Espace Partenaire
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5 inline mr-2" />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="h-5 w-5 inline mr-2" />
                  Connexion
                </Link>
                <Link
                  to="/partner-login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-green-600 hover:bg-green-700 hover:bg-opacity-10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Building2 className="h-5 w-5 inline mr-2" />
                  Espace Partenaire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};