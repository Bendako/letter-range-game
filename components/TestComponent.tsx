'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";

// components/TestComponent.tsx
const TestComponent = () => {
  // const [isHovered, setIsHovered] = useState(false);
  const [isDisabled] = useState(true); // or false based on your logic


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-purple-600 text-white">
      <h1 className="text-5xl font-bold mb-4 animate-bounce">Welcome to Letter Range!</h1>
      <p className="text-xl mb-8">Learn English letters by shooting moving targets!</p>
      <Button 
        className={`start-button ${isDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg transition duration-200 ease-in-out rounded-lg'}`} 
        disabled={isDisabled}
        >
        Start
      </Button>
      <p className="mt-4 text-lg italic">This game is currently in development.</p>
    </div>
  );
};

export default TestComponent;