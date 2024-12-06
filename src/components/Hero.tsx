import React from 'react';
import { ArrowRight, Building2 } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
          alt="Modern interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 mix-blend-multiply" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col justify-center h-full pt-20">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Trouvez des toilettes propres et confortables
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl">
            Accédez aux toilettes des meilleurs établissements de la ville. Réservez en quelques clics pour une expérience garantie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#booking"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
            >
              Réserver maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="#partner"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
            >
              Devenir Partenaire
              <Building2 className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};