import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <AlertTriangle className="h-24 w-24 text-red-500" />
              <span className="absolute -bottom-2 -right-2 text-4xl">404</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Page introuvable
          </h1>
          
          <p className="text-gray-600 mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>

          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
          >
            <Home className="h-5 w-5 mr-2" />
            Retour à l'accueil
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          Si vous pensez qu'il s'agit d'une erreur, veuillez nous contacter.
        </div>
      </div>
    </div>
  );
};