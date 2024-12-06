import React from 'react';
import { Clock } from 'lucide-react';

interface OpeningHours {
  [key: string]: {
    open: string;
    close: string;
    closed: boolean;
  };
}

interface OpeningHoursEditorProps {
  openingHours: OpeningHours;
  onChange: (hours: OpeningHours) => void;
}

const DAYS = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche'
};

export const OpeningHoursEditor: React.FC<OpeningHoursEditorProps> = ({ openingHours, onChange }) => {
  const handleChange = (day: string, field: string, value: string | boolean) => {
    onChange({
      ...openingHours,
      [day]: {
        ...openingHours[day],
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <Clock className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="text-lg font-medium">Horaires d'ouverture</h3>
      </div>

      {Object.entries(DAYS).map(([day, label]) => (
        <div key={day} className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium">{label}</span>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={!openingHours[day].closed}
                onChange={(e) => handleChange(day, 'closed', !e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
              />
              <span className="text-sm text-gray-600">
                {openingHours[day].closed ? 'Fermé' : 'Ouvert'}
              </span>
            </label>
          </div>

          {!openingHours[day].closed && (
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Ouverture</label>
                <input
                  type="time"
                  value={openingHours[day].open}
                  onChange={(e) => handleChange(day, 'open', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Fermeture</label>
                <input
                  type="time"
                  value={openingHours[day].close}
                  onChange={(e) => handleChange(day, 'close', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};