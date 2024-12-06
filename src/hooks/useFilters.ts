import { useState } from 'react';

export interface Filters {
  features: {
    babyChange: boolean;
    wifi: boolean;
    eco: boolean;
    security: boolean;
    petFriendly: boolean;
    shower: boolean;
  };
  type: {
    free: boolean;
    paid: boolean;
  };
}

export const useFilters = () => {
  const [filters, setFilters] = useState<Filters>({
    features: {
      babyChange: false,
      wifi: false,
      eco: false,
      security: false,
      petFriendly: false,
      shower: false,
    },
    type: {
      free: true,
      paid: true,
    }
  });

  return { filters, setFilters };
};