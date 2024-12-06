import React from 'react';
import { Bath, Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Bath className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-white">ToiletPass</span>
            </div>
            <p className="text-sm">
              Trouvez facilement des toilettes propres et confortables partout en ville.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="hover:text-blue-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="hover:text-blue-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="hover:text-blue-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-500 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-500 transition-colors">
                  Se connecter
                </Link>
              </li>
              <li>
                <Link to="/partner-login" className="hover:text-blue-500 transition-colors">
                  Devenir partenaire
                </Link>
              </li>
              <li>
                <a href="#about" className="hover:text-blue-500 transition-colors">
                  Comment ça marche
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <a href="mailto:contact@toiletpass.com" className="hover:text-blue-500 transition-colors">
                  contact@toiletpass.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <a href="tel:+33123456789" className="hover:text-blue-500 transition-colors">
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Paris, France</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Newsletter</h3>
            <p className="text-sm mb-4">
              Restez informé de nos dernières actualités et mises à jour.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Votre email"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm">
              © {currentYear} ToiletPass. Tous droits réservés.
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <Link to="/privacy" className="hover:text-blue-500 transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="/terms" className="hover:text-blue-500 transition-colors">
                Conditions d'utilisation
              </Link>
              <Link to="/legal" className="hover:text-blue-500 transition-colors">
                Mentions légales
              </Link>
            </div>
            <div className="text-sm flex items-center">
              Fait avec <Heart className="h-4 w-4 text-red-500 mx-1" /> en France
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};