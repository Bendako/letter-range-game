'use client';

import { useState } from "react";

// components/TestComponent.tsx
const TestComponent = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-purple-600 text-white">
      <h1 className="text-5xl font-bold mb-4 animate-bounce">Welcome to Letter Range!</h1>
      <p className="text-xl mb-8">Learn English letters by shooting moving targets!</p>
      <button
        id="start-button"
        className={`bg-white text-blue-600 font-bold py-2 px-4 rounded shadow-lg transition-transform transform ${isHovered ? 'animate-pulse' : ''} hover:scale-105`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled
      >
        Start Game
      </button>
      <p className="mt-4 text-lg italic">This game is currently in development.</p>
    </div>
  );
};

export default TestComponent;