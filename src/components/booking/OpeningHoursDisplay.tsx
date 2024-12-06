import React from 'react';
import { Clock } from 'lucide-react';

interface OpeningHours {
  [key: string]: {
    open: string;
    close: string;
    closed: boolean;
  };
}

interface OpeningHoursDisplayProps {
  openingHours: OpeningHours;
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

export const OpeningHoursDisplay: React.FC<OpeningHoursDisplayProps> = ({ openingHours }) => {
  const getCurrentStatus = () => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('fr-FR', { weekday: 'monday' }).toLowerCase();
    const currentTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const todayHours = openingHours[currentDay];
    if (!todayHours || todayHours.closed) return false;

    return currentTime >= todayHours.open && currentTime <= todayHours.close;
  };

  const isOpen = getCurrentStatus();

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center mb-4">
        <Clock className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="text-lg font-medium">Horaires d'ouverture</h3>
      </div>

      <div className="space-y-2">
        {Object.entries(DAYS).map(([day, label]) => {
          const hours = openingHours[day];
          const isToday = new Date().toLocaleDateString('fr-FR', { weekday: 'monday' }).toLowerCase() === day;

          return (
            <div key={day} className="flex justify-between items-center">
              <span className={`font-medium ${isToday ? 'text-blue-600' : ''}`}>
                {label}
              </span>
              <span className={`${
                hours.closed ? 'text-red-600' : 
                isToday ? (isOpen ? 'text-green-600' : 'text-red-600') : 
                'text-gray-600'
              }`}>
                {hours.closed ? 'Fermé' : `${hours.open} - ${hours.close}`}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t text-center">
        <span className={`font-medium ${isOpen ? 'text-green-600' : 'text-red-600'}`}>
          {isOpen ? 'Ouvert actuellement' : 'Fermé actuellement'}
        </span>
      </div>
    </div>
  );
};