import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddToiletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const AddToiletModal = ({ isOpen, onClose, onSubmit }: AddToiletModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amenities: {
      accessible: false,
      babyChange: false,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      type: 'public',
      price: '0€',
      features: {
        wifi: false,
        shower: false,
        coffee: false,
        eco: true,
        security: true,
        petFriendly: true,
      },
    });
    setFormData({
      name: '',
      description: '',
      amenities: {
        accessible: false,
        babyChange: false,
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ajouter des toilettes publiques</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du lieu
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-md"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ex: Toilettes Jardin des Tuileries"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-md"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Informations utiles sur l'emplacement..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Équipements
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded text-blue-600 mr-2"
                  checked={formData.amenities.accessible}
                  onChange={(e) => setFormData({
                    ...formData,
                    amenities: { ...formData.amenities, accessible: e.target.checked }
                  })}
                />
                Accessible PMR
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded text-blue-600 mr-2"
                  checked={formData.amenities.babyChange}
                  onChange={(e) => setFormData({
                    ...formData,
                    amenities: { ...formData.amenities, babyChange: e.target.checked }
                  })}
                />
                Table à langer
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};