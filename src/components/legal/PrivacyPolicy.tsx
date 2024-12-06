import { Link } from 'react-router-dom';
import { Shield, Home } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            Politique de Confidentialité
          </h1>
          <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <Home className="h-5 w-5 mr-2" />
            Retour à l'accueil
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Collecte des données</h2>
            <p className="text-gray-600 mb-4">
              Nous collectons les informations suivantes lorsque vous utilisez ToiletPass :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Informations de compte (nom, email, numéro de téléphone)</li>
              <li>Données de localisation lors de l'utilisation de la carte</li>
              <li>Historique des réservations et transactions</li>
              <li>Avis et commentaires</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Utilisation des données</h2>
            <p className="text-gray-600 mb-4">
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Gérer votre compte et vos réservations</li>
              <li>Améliorer nos services</li>
              <li>Vous envoyer des notifications importantes</li>
              <li>Assurer la sécurité de notre plateforme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Protection des données</h2>
            <p className="text-gray-600 mb-4">
              Nous mettons en œuvre des mesures de sécurité pour protéger vos données :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Chiffrement des données sensibles</li>
              <li>Accès restreint aux données personnelles</li>
              <li>Surveillance continue de notre infrastructure</li>
              <li>Mises à jour régulières de nos systèmes de sécurité</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Vos droits</h2>
            <p className="text-gray-600 mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d'opposition au traitement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Cookies</h2>
            <p className="text-gray-600 mb-4">
              Nous utilisons des cookies pour :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Maintenir votre session</li>
              <li>Mémoriser vos préférences</li>
              <li>Analyser l'utilisation de notre service</li>
              <li>Améliorer la performance du site</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Contact</h2>
            <p className="text-gray-600">
              Pour toute question concernant notre politique de confidentialité, contactez-nous à :
              <a href="mailto:privacy@toiletpass.com" className="text-blue-600 ml-2 hover:underline">
                privacy@toiletpass.com
              </a>
            </p>
          </section>

          <div className="text-sm text-gray-500 pt-8 border-t">
            Dernière mise à jour : {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};