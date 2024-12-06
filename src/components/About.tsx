import { Bath, Shield, Clock, CreditCard, Users, Building2 } from 'lucide-react';

export const About = () => {
  return (
    <div id="about" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ToiletPass révolutionne l'accès aux toilettes en ville en proposant un réseau d'établissements partenaires de qualité.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Trouvez</h3>
            <p className="text-gray-600">
              Localisez les toilettes les plus proches sur notre carte interactive
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Réservez</h3>
            <p className="text-gray-600">
              Payez en ligne et recevez votre QR code d'accès instantanément
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bath className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Profitez</h3>
            <p className="text-gray-600">
              Présentez votre QR code à l'établissement et accédez aux toilettes
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Pourquoi choisir ToiletPass ?</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium">Hygiène garantie</h4>
                    <p className="mt-2 text-gray-600">
                      Tous nos établissements partenaires respectent des normes strictes de propreté et d'hygiène.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium">Disponibilité 24/7</h4>
                    <p className="mt-2 text-gray-600">
                      Accédez à notre réseau de toilettes à tout moment, partout en ville.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium">Réseau de qualité</h4>
                    <p className="mt-2 text-gray-600">
                      Des établissements soigneusement sélectionnés pour vous garantir le meilleur service.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Interior of modern bathroom"
                className="rounded-lg shadow-lg object-cover h-full"
              />
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-8">Ce qu'en pensent nos utilisateurs</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 mb-4">
                "Une solution parfaite quand on est en ville ! Plus besoin de chercher désespérément des toilettes propres."
              </p>
              <p className="font-medium">Suzy D.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 mb-4">
                "Le système de réservation est simple et efficace. Les établissements sont toujours de qualité."
              </p>
              <p className="font-medium">Pierre L.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 mb-4">
                "Je recommande vivement ! C'est rassurant de savoir qu'on peut trouver des toilettes propres facilement."
              </p>
              <p className="font-medium">Jeremie B.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};