// File: components/GameOverScreen.tsx
import React, { useEffect } from 'react';

type GameOverScreenProps = {
  score: number;
  onRestart: () => void;
};

const GameOverScreen = ({ score, onRestart }: GameOverScreenProps) => {
  useEffect(() => {
    // Add keyboard event listener for Enter and Space
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onRestart();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRestart]);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onRestart();
    }
  };

  // Calculate stars based on score
  const getStars = () => {
    if (score >= 2000) return 3;
    if (score >= 1000) return 2;
    return 1;
  };

  const stars = getStars();

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 z-20">
      <div className="flex flex-col items-center text-center p-8 bg-slate-900 rounded-xl shadow-2xl max-w-md">
        <h1 className="text-5xl font-bold mb-2 text-white">GAME OVER</h1>
        
        <div className="text-2xl text-yellow-400 font-bold my-4">
          {score >= 2000 ? "INCREDIBLE!" : score >= 1000 ? "WELL DONE!" : "NICE TRY!"}
        </div>
        
        <div className="flex space-x-2 my-4">
          {[...Array(3)].map((_, i) => (
            <svg 
              key={i} 
              className={`w-8 h-8 ${i < stars ? 'text-yellow-400' : 'text-gray-600'}`}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        
        <div className="my-6 p-6 bg-slate-800 rounded-lg">
          <p className="text-4xl font-bold text-white mb-1">
            {score}
          </p>
          <p className="text-slate-400">FINAL SCORE</p>
        </div>
        
        <div className="mt-2 mb-6 text-slate-300">
          <p>Can you beat your score?</p>
        </div>
        
        <button
          className="w-full px-8 py-4 bg-yellow-500 text-slate-900 font-bold rounded-lg text-xl hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-colors"
          onClick={onRestart}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-label="Play Again"
        >
          PLAY AGAIN
        </button>
        
        <p className="mt-6 text-slate-400 text-sm">
          Press ENTER or SPACE to restart
        </p>
      </div>
    </div>
  );
};

export default GameOverScreen;