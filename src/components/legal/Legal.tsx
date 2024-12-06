import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Home } from 'lucide-react';

export const Legal = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Scale className="h-8 w-8 text-blue-600 mr-3" />
            Mentions Légales
          </h1>
          <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <Home className="h-5 w-5 mr-2" />
            Retour à l'accueil
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Informations légales</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                <strong>Raison sociale :</strong> ToiletPass SAS
              </p>
              <p>
                <strong>Siège social :</strong> 123 Avenue des Champs-Élysées, 75008 Paris
              </p>
              <p>
                <strong>SIRET :</strong> 123 456 789 00012
              </p>
              <p>
                <strong>Capital social :</strong> 10 000€
              </p>
              <p>
                <strong>RCS :</strong> Paris B 123 456 789
              </p>
              <p>
                <strong>N° TVA :</strong> FR 12 345 678 901
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Direction de la publication</h2>
            <div className="space-y-2 text-gray-600">
              <p>
                <strong>Directeur de la publication :</strong> Jean Dupont
              </p>
              <p>
                <strong>Contact :</strong>{' '}
                <a href="mailto:direction@toiletpass.com" className="text-blue-600 hover:underline">
                  direction@toiletpass.com
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Hébergement</h2>
            <div className="space-y-2 text-gray-600">
              <p>
                <strong>Hébergeur :</strong> Netlify, Inc.
              </p>
              <p>
                <strong>Adresse :</strong> 2325 3rd Street, Suite 215, San Francisco, CA 94107
              </p>
              <p>
                <strong>Site web :</strong>{' '}
                <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  www.netlify.com
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Propriété intellectuelle</h2>
            <p className="text-gray-600">
              L'ensemble du contenu du site ToiletPass (logos, textes, éléments graphiques, vidéos, etc.) 
              est protégé par le droit d'auteur. Toute reproduction, même partielle, est interdite sans 
              autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Protection des données</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Conformément à la loi Informatique et Libertés et au RGPD, vous disposez d'un droit 
                d'accès, de rectification et de suppression de vos données personnelles.
              </p>
              <p>
                <strong>Délégué à la protection des données :</strong>{' '}
                <a href="mailto:dpo@toiletpass.com" className="text-blue-600 hover:underline">
                  dpo@toiletpass.com
                </a>
              </p>
              <p>
                Pour plus d'informations, consultez notre{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  politique de confidentialité
                </Link>
                .
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Médiation</h2>
            <p className="text-gray-600">
              Conformément à l'article L. 612-1 du Code de la consommation, vous pouvez recourir 
              gratuitement au service de médiation MEDICYS dont nous relevons :
            </p>
            <div className="mt-4 space-y-2 text-gray-600">
              <p>
                <strong>Par voie électronique :</strong>{' '}
                <a href="https://medicys.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  www.medicys.fr
                </a>
              </p>
              <p>
                <strong>Par voie postale :</strong> MEDICYS - 73 Boulevard de Clichy - 75009 Paris
              </p>
            </div>
          </section>

          <div className="text-sm text-gray-500 pt-8 border-t">
            Dernière mise à jour : {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};