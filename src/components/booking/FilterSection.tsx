import React from 'react';
import { 
  Wifi, Baby, Leaf, Shield, Dog, Euro, CircleDollarSign, Droplets
} from 'lucide-react';
import { Filters } from '../../hooks/useFilters';

interface FeatureCheckboxProps {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const FeatureCheckbox: React.FC<FeatureCheckboxProps> = ({ icon, label, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="flex items-center text-sm text-gray-700">
        {icon}
        <span className="ml-1">{label}</span>
      </span>
    </label>
  );
};

interface FilterSectionProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export const FilterSection: React.FC<FilterSectionProps> = ({ filters, setFilters }) => {
  const updateFeature = (feature: keyof Filters['features'], value: boolean) => {
    setFilters(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: value
      }
    }));
  };

  const updateType = (type: keyof Filters['type'], value: boolean) => {
    setFilters(prev => ({
      ...prev,
      type: {
        ...prev.type,
        [type]: value
      }
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <h3 className="text-lg font-semibold mb-4">Filtres</h3>
      
      {/* Type de toilettes */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Type</h4>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <FeatureCheckbox
            icon={<CircleDollarSign className="h-4 w-4 text-green-600" />}
            label="Gratuites"
            checked={filters.type.free}
            onChange={(checked) => updateType('free', checked)}
          />
          <FeatureCheckbox
            icon={<Euro className="h-4 w-4 text-blue-600" />}
            label="Payantes"
            checked={filters.type.paid}
            onChange={(checked) => updateType('paid', checked)}
          />
        </div>
      </div>

      {/* Équipements */}
      <h4 className="text-sm font-medium text-gray-700 mb-3">Équipements</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <FeatureCheckbox
          icon={<Baby className="h-4 w-4" />}
          label="Table à langer"
          checked={filters.features.babyChange}
          onChange={(checked) => updateFeature('babyChange', checked)}
        />

        <FeatureCheckbox
          icon={<Wifi className="h-4 w-4" />}
          label="Wi-Fi"
          checked={filters.features.wifi}
          onChange={(checked) => updateFeature('wifi', checked)}
        />

        <FeatureCheckbox
          icon={<Leaf className="h-4 w-4" />}
          label="Écologique"
          checked={filters.features.eco}
          onChange={(checked) => updateFeature('eco', checked)}
        />

        <FeatureCheckbox
          icon={<Shield className="h-4 w-4" />}
          label="Sécurisé"
          checked={filters.features.security}
          onChange={(checked) => updateFeature('security', checked)}
        />

        <FeatureCheckbox
          icon={<Dog className="h-4 w-4" />}
          label="Animaux acceptés"
          checked={filters.features.petFriendly}
          onChange={(checked) => updateFeature('petFriendly', checked)}
        />

        <FeatureCheckbox
          icon={<Droplets className="h-4 w-4" />}
          label="Douche"
          checked={filters.features.shower}
          onChange={(checked) => updateFeature('shower', checked)}
        />
      </div>
    </div>
  );
};