import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FilterSection } from "./booking/FilterSection";
import { LocationSearch } from "./booking/LocationSearch";
import { ToiletPopup } from "./booking/ToiletPopup";
import { useToilets } from "../hooks/useToilets";
import { useFilters } from "../hooks/useFilters";
import { useAuthContext } from "../contexts/AuthContext";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

// Suppression des anciens icônes par défaut
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Icône personnalisée pour la position de l'utilisateur
const userIcon = L.divIcon({
  className: "custom-user-marker",
  html: `
    <div style="
      background-color: #3b82f6;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 0 2px #3b82f6;
    "></div>
    <div style="
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(59, 130, 246, 0.2);
      animation: pulse 2s infinite;
    "></div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Fonction pour créer un marqueur de prix personnalisé
const createPriceMarker = (price: string | number, isFree: boolean = false) => {
  const displayPrice = isFree ? "Gratuit" : `${price}€`;
  const textColor = isFree ? "#16a34a" : "#2563eb";

  return L.divIcon({
    className: "custom-price-marker",
    html: `
      <div style="
        background-color: white;
        color: ${textColor};
        padding: 4px 12px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 14px;
        border: 1px solid ${textColor};
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        white-space: nowrap;
        cursor: pointer;
      ">
        ${displayPrice}
      </div>
    `,
    iconSize: [40, 20],
    iconAnchor: [20, 10],
  });
};

// Composant pour mettre à jour la vue de la carte
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

// Composant pour gérer la position de l'utilisateur
const LocationMarker = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate({ watch: true, enableHighAccuracy: true });

    map.on("locationfound", (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.setView(e.latlng, map.getZoom());
    });

    return () => {
      map.stopLocate();
      map.off("locationfound");
    };
  }, [map]);

  return position ? (
    <Marker position={position} icon={userIcon}>
      <Popup>
        <div className="text-center">
          <p className="font-medium">Vous êtes ici</p>
          <p className="text-sm text-gray-600">Position en temps réel</p>
        </div>
      </Popup>
    </Marker>
  ) : null;
};

// Définition du type de donnée pour les toilettes
interface Toilet {
  id: string;
  name: string;
  address: string;
  position: [number, number];
  price: string;
  rating: number;
  amenities: string[];
  type: string;
  features: {
    wifi: boolean;
    babyChange: boolean;
    eco: boolean;
    coffee: boolean;
    shower: boolean;
    security: boolean;
    petFriendly: boolean;
  };
}

export const BookingMap = () => {
  const { user } = useAuthContext();
  const { toilets, setToilets } = useToilets();
  const { filters, setFilters } = useFilters();
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.8566, 2.3522]);

  useEffect(() => {
    const fetchEstablishments = async () => {
      try {
        const establishmentsQuery = query(collection(db, "establishments"));
        const querySnapshot = await getDocs(establishmentsQuery);
        const establishmentsData: Toilet[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Unknown Name",
            address: data.address || "Unknown Address",
            position: data.position || [0, 0],
            price: data.price || "0",
            rating: data.rating || 0,
            amenities: data.amenities || [],
            type: data.type || "public",
            features: data.features || {},
          };
        });

        const validEstablishments = establishmentsData.filter((est) => est.position && Array.isArray(est.position) && est.position.length === 2 && !isNaN(est.position[0]) && !isNaN(est.position[1]));

        setToilets(validEstablishments);
      } catch (err) {
        console.error("Error fetching establishments:", err);
      }
    };

    fetchEstablishments();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleLocationSelect = (location: [number, number]) => {
    setMapCenter(location);
  };

  const filteredToilets = toilets.filter((toilet) => {
    const isFree = Number(toilet.price) === 0 || toilet.type === "public";
    const typeMatch = (isFree && filters.type.free) || (!isFree && filters.type.paid);

    const featureMatch = Object.entries(filters.features).every(([key, value]) => {
      if (!value) return true;
      return toilet.features?.[key as keyof typeof toilet.features];
    });

    return typeMatch && featureMatch;
  });

  return (
    <div id="booking" className="bg-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Trouvez des toilettes</h2>
          <p className="text-lg text-gray-600 mb-6">{!user ? "Connectez-vous pour réserver" : "Sélectionnez des toilettes sur la carte pour réserver"}</p>
          <LocationSearch onLocationSelect={handleLocationSelect} />
        </div>

        <FilterSection filters={filters} setFilters={setFilters} />

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <MapContainer center={mapCenter} zoom={15} style={{ height: "600px", width: "100%" }}>
            <MapUpdater center={mapCenter} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
            <LocationMarker />
            {filteredToilets.map((toilet) => {
              const isFree = Number(toilet.price) === 0 || toilet.type === "public";
              const price = isFree ? 0 : toilet.price || 2;

              return (
                <Marker key={toilet.id} position={toilet.position as [number, number]} icon={createPriceMarker(price, isFree)}>
                  <Popup>
                    <ToiletPopup
                      toilet={{
                        id: toilet.id,
                        name: toilet.name,
                        address: "Unknown Address", // Ensure address is passed
                        price: toilet.price,
                        position: toilet.position,
                        rating: toilet.rating,
                        amenities: toilet.amenities,
                        type: toilet.type,
                        features: toilet.features,
                      }}
                      onLogin={() => console.log("Login needed")}
                    />
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};
