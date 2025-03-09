// File: components/Crosshair.tsx
"use client";

import React from 'react';

const Crosshair = () => {
  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-20">
      <div className="relative w-10 h-10">
        {/* Horizontal line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 opacity-80 transform -translate-y-1/2"></div>
        
        {/* Vertical line */}
        <div className="absolute top-0 left-1/2 w-0.5 h-full bg-red-500 opacity-80 transform -translate-x-1/2"></div>
        
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
};

export default Crosshair;