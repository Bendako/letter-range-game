// File: components/StartScreen.tsx
import React, { useEffect } from 'react';

type StartScreenProps = {
  onStart: () => void;
};

const StartScreen = ({ onStart }: StartScreenProps) => {
  useEffect(() => {
    // Add keyboard event listener for Enter and Space
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onStart();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onStart();
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black to-slate-900 z-20">
      <div className="flex flex-col items-center text-center max-w-md p-8">
        <h1 className="text-6xl font-bold mb-6 text-white tracking-wider">
          <span className="text-yellow-400">WORD</span> SHOOTER
        </h1>
        
        <div className="mb-8 text-slate-300 text-lg">
          <p className="mb-4">
            Test your reflexes and spelling in this fast-paced 3D shooter!
          </p>
          <p>
            Shoot the letters to spell the target words before time runs out.
          </p>
        </div>
        
        <div className="mb-8 bg-slate-800 p-4 rounded-lg text-slate-200">
          <h2 className="text-xl font-bold mb-2 text-yellow-400">HOW TO PLAY</h2>
          <ul className="text-left">
            <li className="flex items-start mb-2">
              <span className="text-yellow-400 mr-2">•</span>
              <span>Aim with your mouse</span>
            </li>
            <li className="flex items-start mb-2">
              <span className="text-yellow-400 mr-2">•</span>
              <span>Click to shoot letters</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span>Spell words in the correct order</span>
            </li>
          </ul>
        </div>
        
        <button
          className="px-8 py-4 bg-yellow-500 text-slate-900 font-bold rounded-lg text-xl hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-colors shadow-lg relative overflow-hidden group"
          onClick={onStart}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-label="Start Game"
        >
          <span className="relative z-10">START GAME</span>
          <span className="absolute inset-0 bg-yellow-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
        </button>
        
        <p className="mt-6 text-slate-400 text-sm">
          Press ENTER or SPACE to start
        </p>
      </div>
    </div>
  );
};

export default StartScreen;