import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Mail, Lock, MapPin, Phone, Euro, Bath, DoorClosed } from "lucide-react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

export const PartnerLogin = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    establishmentName: "",
    address: "",
    phone: "",
    toiletsCount: 1,
    showersCount: 0,
    price: 2,
    position: null as [number, number] | null,
    openingHours: {
      monday: { open: "09:00", close: "18:00", closed: false },
      tuesday: { open: "09:00", close: "18:00", closed: false },
      wednesday: { open: "09:00", close: "18:00", closed: false },
      thursday: { open: "09:00", close: "18:00", closed: false },
      friday: { open: "09:00", close: "18:00", closed: false },
      saturday: { open: "09:00", close: "18:00", closed: false },
      sunday: { open: "09:00", close: "18:00", closed: true },
    },
    features: {
      babyChange: false,
      wifi: false,
      eco: false,
      security: false,
      petFriendly: false,
      coffee: false,
      shower: false,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Connexion
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        console.log({ userCredential });
        navigate("/admin");
      } else {
        // Inscription
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

        // Créer le profil partenaire dans Firestore
        await setDoc(doc(db, "establishments", userCredential.user.uid), {
          establishmentName: formData.establishmentName,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          toiletsCount: formData.toiletsCount,
          showersCount: formData.showersCount,
          price: formData.price,
          position: formData.position,
          openingHours: formData.openingHours,
          type: "partner",
          status: "pending",
          ownerId: userCredential.user.uid,
          createdAt: new Date(),
          features: formData.features,
        });

        navigate("/admin");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === "auth/invalid-credential") {
        setError("Email ou mot de passe incorrect");
      } else if (err.code === "auth/email-already-in-use") {
        setError("Cet email est déjà utilisé");
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Building2 className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{isLogin ? "Espace Partenaire" : "Devenir Partenaire"}</h2>
        <div className="mt-2 text-center">
          <Link to="/" className="text-green-600 hover:text-green-500">
            ← Retour à l'accueil
          </Link>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Pas encore partenaire ?" : "Déjà partenaire ?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-green-600 hover:text-green-500">
              {isLogin ? "Rejoignez-nous" : "Connectez-vous"}
            </button>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom de l'établissement</label>
                  <div className="mt-1 relative">
                    <input type="text" required className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={formData.establishmentName} onChange={(e) => setFormData({ ...formData, establishmentName: e.target.value })} />
                    <Building2 className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Adresse</label>
                  <div className="mt-1 relative">
                    <input type="text" required className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                    <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <div className="mt-1 relative">
                    <input type="tel" required className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre de toilettes</label>
                    <div className="mt-1 relative">
                      <input type="number" min="1" required className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={formData.toiletsCount} onChange={(e) => setFormData({ ...formData, toiletsCount: parseInt(e.target.value) })} />
                      <DoorClosed className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre de douches</label>
                    <div className="mt-1 relative">
                      <input type="number" min="0" required className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={formData.showersCount} onChange={(e) => setFormData({ ...formData, showersCount: parseInt(e.target.value) })} />
                      <Bath className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Prix par utilisation (€)</label>
                  <div className="mt-1 relative">
                    <input type="number" min="0.5" step="0.5" required className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} />
                    <Euro className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horaires d'ouverture</label>
                  {Object.entries(formData.openingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center space-x-4 mb-2">
                      <span className="w-24 text-sm capitalize">{day}</span>
                      <input
                        type="checkbox"
                        checked={!hours.closed}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            openingHours: {
                              ...formData.openingHours,
                              [day]: { ...hours, closed: !e.target.checked },
                            },
                          })
                        }
                        className="mr-2"
                      />
                      {!hours.closed && (
                        <>
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                openingHours: {
                                  ...formData.openingHours,
                                  [day]: { ...hours, open: e.target.value },
                                },
                              })
                            }
                            className="border rounded px-2 py-1"
                          />
                          <span>-</span>
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                openingHours: {
                                  ...formData.openingHours,
                                  [day]: { ...hours, close: e.target.value },
                                },
                              })
                            }
                            className="border rounded px-2 py-1"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email professionnel</label>
              <div className="mt-1 relative">
                <input type="email" required className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <div className="mt-1 relative">
                <input type="password" required className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
                {loading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
