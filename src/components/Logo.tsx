import React from 'react';

export const Logo = () => {
  return (
    <div className="relative w-10 h-10">
      {/* Toilet Bowl */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full text-blue-600"
      >
        <path d="M4 12c0-4 3.333-8 8-8s8 4 8 8c0 1.333-.333 2.667-1 4H5c-.667-1.333-1-2.667-1-4z" />
        <path d="M8 20c0-2 2-2 4-2s4 0 4 2" />
        <path d="M5 12h14" />
        {/* Pineapple Body */}
        <path d="M12 8c-.5-1.5.5-3 2-3s2.5 1.5 2 3c-.5 1.5-2 2-2 2s-1.5-.5-2-2z" className="text-yellow-500" />
        {/* Pineapple Crown */}
        <path d="M14 5c0-1 .5-1.5 1-1.5s1 .5 1 1.5c0 1-1 1-1 1s-1 0-1-1z" className="text-green-500" />
        {/* Diamond Pattern */}
        <path d="M13 7.5l.5.5M14.5 7.5l.5.5M13.5 8.5l.5.5" className="text-yellow-700" />
      </svg>
    </div>
  );
};