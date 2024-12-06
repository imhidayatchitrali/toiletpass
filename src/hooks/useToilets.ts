import { useState } from 'react';

interface Toilet {
  id: string;
  name: string;
  position: [number, number];
  price: string;
  rating: number;
  amenities: string[];
  type: string;
  features: {
    wifi: boolean;
    shower: boolean;
    coffee: boolean;
    eco: boolean;
    babyChange: boolean;
  };
}

export const useToilets = () => {
  const [toilets, setToilets] = useState<Toilet[]>([]);

  return { toilets, setToilets };
};