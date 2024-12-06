import { Link } from 'react-router-dom';
import { FileText, Home } from 'lucide-react';

export const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            Conditions d'Utilisation
          </h1>
          <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <Home className="h-5 w-5 mr-2" />
            Retour à l'accueil
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Acceptation des conditions</h2>
            <p className="text-gray-600">
              En utilisant ToiletPass, vous acceptez d'être lié par les présentes conditions d'utilisation.
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Description du service</h2>
            <p className="text-gray-600 mb-4">
              ToiletPass est une plateforme permettant aux utilisateurs de :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Localiser des toilettes publiques et privées</li>
              <li>Réserver et payer l'accès aux toilettes partenaires</li>
              <li>Consulter et laisser des avis</li>
              <li>Ajouter des toilettes publiques à la carte</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Inscription et compte</h2>
            <p className="text-gray-600 mb-4">
              Pour utiliser certaines fonctionnalités, vous devez :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Créer un compte avec des informations exactes</li>
              <li>Maintenir la confidentialité de vos identifiants</li>
              <li>Être responsable de toute activité sur votre compte</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Règles d'utilisation</h2>
            <p className="text-gray-600 mb-4">
              En utilisant ToiletPass, vous vous engagez à :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Respecter les lois en vigueur</li>
              <li>Ne pas publier de contenu inapproprié ou offensant</li>
              <li>Ne pas perturber le fonctionnement du service</li>
              <li>Ne pas créer de faux avis ou signalements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Paiements et remboursements</h2>
            <p className="text-gray-600 mb-4">
              Concernant les transactions :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Les paiements sont sécurisés via Stripe</li>
              <li>Les prix sont indiqués TTC</li>
              <li>Les remboursements sont possibles sous conditions</li>
              <li>Les QR codes sont à usage unique</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Responsabilité</h2>
            <p className="text-gray-600">
              ToiletPass ne peut être tenu responsable :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Des informations fournies par les utilisateurs</li>
              <li>De l'indisponibilité temporaire du service</li>
              <li>Des dommages indirects liés à l'utilisation du service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. Modification des conditions</h2>
            <p className="text-gray-600">
              Nous nous réservons le droit de modifier ces conditions à tout moment.
              Les modifications prennent effet dès leur publication.
              L'utilisation continue du service après modification constitue l'acceptation des nouvelles conditions.
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