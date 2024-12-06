import React, { useRef, useState } from 'react';
import { Camera, Trash2, Loader, User } from 'lucide-react';
import { useProfilePhoto } from '../../hooks/useProfilePhoto';

interface ProfilePhotoProps {
  userId: string;
  currentPhotoURL: string | null;
  onPhotoUpdate: (url: string | null) => void;
}

export const ProfilePhoto = ({ userId, currentPhotoURL, onPhotoUpdate }: ProfilePhotoProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadPhoto, deletePhoto, uploading, error } = useProfilePhoto(userId);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const photoURL = await uploadPhoto(file);
      if (photoURL) {
        onPhotoUpdate(photoURL);
        setImgError(false);
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!currentPhotoURL) return;

    try {
      const success = await deletePhoto(currentPhotoURL);
      if (success) {
        onPhotoUpdate(null);
        setShowDeleteConfirm(false);
        setImgError(false);
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  };

  return (
    <div className="relative">
      <div className="h-24 w-24 rounded-full bg-white p-1 shadow-sm">
        <div className="h-full w-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          {currentPhotoURL && !imgError ? (
            <img
              src={currentPhotoURL}
              alt="Photo de profil"
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <User className="h-12 w-12 text-gray-400" />
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {uploading ? (
        <div className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg">
          <Loader className="h-5 w-5 text-blue-600 animate-spin" />
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-50"
          disabled={uploading}
        >
          <Camera className="h-5 w-5 text-gray-600" />
        </button>
      )}

      {currentPhotoURL && !uploading && (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}

      {error && (
        <div className="absolute top-full mt-2 w-48 bg-red-50 text-red-600 text-xs p-2 rounded">
          {error}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full m-4">
            <h3 className="text-lg font-semibold mb-4">Supprimer la photo</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer votre photo de profil ?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};