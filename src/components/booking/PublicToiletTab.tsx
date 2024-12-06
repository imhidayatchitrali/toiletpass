import React from "react";
import { Plus, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { usePublicToilets } from "../../hooks/usePublicToilets";

export const PublicToiletTab: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  // Updated destructuring based on the hook's return type
  const { canAdd, dailyCount, incrementCount } = usePublicToilets(user?.uid || null);
  console.log({ incrementCount });
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">Ajouter des toilettes publiques</h3>
          <p className="text-gray-600 text-sm mb-4">Aidez la communauté en ajoutant des toilettes publiques sur la carte</p>
        </div>
        {user && (
          <div className="bg-blue-50 px-3 py-1 rounded-full">
            <span className="text-sm text-blue-600">
              {dailyCount} ajout{dailyCount > 1 ? "s" : ""} restant{dailyCount > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {!user ? (
        <div className="bg-gray-50 rounded-lg p-4 flex items-start">
          <Info className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">Connectez-vous pour ajouter des toilettes publiques sur la carte</p>
        </div>
      ) : (
        <>
          <button onClick={() => navigate("/add-public-toilet")} disabled={!canAdd} className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <Plus className="h-5 w-5 mr-2" />
            Ajouter des toilettes publiques
          </button>

          {!canAdd && <div className="mt-3 text-sm text-gray-500 text-center">Vous avez atteint la limite quotidienne d'ajouts. Revenez demain !</div>}
        </>
      )}
    </div>
  );
};
