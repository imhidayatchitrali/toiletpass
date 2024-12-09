import { useState } from "react";
import { LogIn, Wifi, AlertCircle, Euro, Baby, Leaf, Coffee, Shield, Dog } from "lucide-react";
import { useAuthContext } from "../../contexts/AuthContext";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../lib/firebase";
import { PaymentModal } from "../payment/PaymentModal";
interface Toilet {
  id: string;
  name: string;
  address: string;
  position: [number, number];
  price: string; // Ensure this is string, not number
  rating: number;
  amenities: string[];
  type: string;
  features?: {
    wifi?: boolean;
    babyChange?: boolean;
    eco?: boolean;
    coffee?: boolean;
    shower?: boolean;
    security?: boolean;
    petFriendly?: boolean;
  };
}

interface ToiletPopupProps {
  toilet: Toilet;
  onLogin: () => void;
}

export const ToiletPopup = ({ toilet, onLogin }: ToiletPopupProps) => {
  const { user } = useAuthContext();
  console.log({ user });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleBooking = async () => {
    if (!user) {
      onLogin();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const createPayment = httpsCallable(functions, "createPayment");
      const result: any = await createPayment({
        amount: parseFloat(toilet.price),
        toiletId: toilet.id,
        establishmentId: toilet.id,
        establishmentName: toilet.name || "",
        establishmentAddress: toilet.address,
        userId: "IKHco0Y1snak5WoKfTdChSwExbH3", // Example user data
        userEmail: "hidayat.rehman64@gmail.com",
        userName: "Hidayat ur Rehman",
      });

      if ("data" in result && result.data && "clientSecret" in result.data) {
        const { clientSecret } = result.data as { clientSecret: string };
        setClientSecret(clientSecret);
        setShowPaymentModal(true);
      } else {
        throw new Error("Invalid server response");
      }
    } catch (err) {
      console.log({ err });
      setError(err instanceof Error ? err.message : "An error occurred during payment");
    } finally {
      setLoading(false);
    }
  };
  console.log({ toilet });
  return (
    <>
      <div className="p-4 max-w-sm">
        <h3 className="font-bold text-lg mb-2">{toilet.name}</h3>

        <div className="space-y-4">
          {toilet.type === "partner" && (
            <div className="flex items-center text-purple-600">
              <Euro className="h-4 w-4 mr-1" />
              <span>{toilet.price}€</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {toilet.features?.wifi && (
              <div className="flex items-center text-gray-600">
                <Wifi className="h-4 w-4 mr-1" />
                <span className="text-sm">Wi-Fi</span>
              </div>
            )}
            {toilet.features?.babyChange && (
              <div className="flex items-center text-gray-600">
                <Baby className="h-4 w-4 mr-1" />
                <span className="text-sm">Table à langer as</span>
              </div>
            )}
            {toilet.features?.eco && (
              <div className="flex items-center text-gray-600">
                <Leaf className="h-4 w-4 mr-1" />
                <span className="text-sm">Écologique</span>
              </div>
            )}
            {toilet.features?.coffee && (
              <div className="flex items-center text-gray-600">
                <Coffee className="h-4 w-4 mr-1" />
                <span className="text-sm">Café</span>
              </div>
            )}
            {toilet.features?.security && (
              <div className="flex items-center text-gray-600">
                <Shield className="h-4 w-4 mr-1" />
                <span className="text-sm">Sécurisé</span>
              </div>
            )}
            {toilet.features?.petFriendly && (
              <div className="flex items-center text-gray-600">
                <Dog className="h-4 w-4 mr-1" />
                <span className="text-sm">Animaux acceptés</span>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          {user ? (
            <button onClick={handleBooking} disabled={loading} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center disabled:opacity-50">
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Euro className="h-4 w-4 mr-2" />
                  Réserver ({toilet.price}€)
                </>
              )}
            </button>
          ) : (
            <button onClick={onLogin} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center">
              <LogIn className="h-4 w-4 mr-2" />
              Se connecter pour réserver
            </button>
          )}
        </div>
      </div>

      {clientSecret && showPaymentModal && <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} clientSecret={clientSecret} amount={parseFloat(toilet.price)} />}
    </>
  );
};
