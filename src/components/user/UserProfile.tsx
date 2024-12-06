import { useNavigate } from "react-router-dom";
import { Shield, Calendar, Wallet, Home } from "lucide-react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useProfile } from "../../hooks/useProfile";

// Define the types for the ProfileData structure
// interface ProfileData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   address: string;
//   photoURL?: string; // Ensure photoURL is part of ProfileData
// }

export const UserProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { profileData, setProfileData } = useProfile(user); // Ensure this hook returns ProfileData type

  const handlePhotoUpdate = (photoURL: string | null) => {
    setProfileData((prev) => ({ ...prev, photoURL })); // Update photoURL
  };
  console.log({ handlePhotoUpdate });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
            <button onClick={() => navigate("/")} className="inline-flex items-center text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-lg shadow-sm">
              <Home className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </button>
          </div>

          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600">
              <div className="absolute -bottom-12 left-8">
                Profile Photo comment
                {/* <ProfilePhoto
                  userId={user?.uid || ""}
                  currentPhotoURL={profileData?.photoURL}
                  onPhotoUpdate={handlePhotoUpdate}
                /> */}
              </div>
            </div>

            <div className="pt-16 px-8 pb-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">
                {profileData?.firstName} {profileData?.lastName}
              </h2>
              <p className="text-gray-600 mt-1">{profileData?.email}</p>
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center px-3 py-1 bg-green-50 rounded-full">
                  <Shield className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-green-700">Compte vérifié</span>
                </div>
                <div className="flex items-center px-3 py-1 bg-blue-50 rounded-full">
                  <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm text-blue-700">Membre depuis {new Date(user?.metadata.creationTime || "").getFullYear()}</span>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    <Wallet className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Ma Cagnotte</h3>
                    <p className="text-2xl font-bold text-purple-600">100.50€</p> {/* Example hardcoded value */}
                  </div>
                </div>
                <button onClick={() => navigate("/wallet")} className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                  Voir les détails
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
