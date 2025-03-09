// File: components/SimpleHUD.tsx
"use client";

import React, { useEffect } from 'react';

type SimpleHUDProps = {
  targetWord: string;
  progress: string;
  score: number;
  timeLeft: number;
  gameStatus: string;
  newLetterInfo?: string;
};

const SimpleHUD = ({ targetWord, progress, score, timeLeft, gameStatus, newLetterInfo }: SimpleHUDProps) => {
  // Debug log to verify rendering
  useEffect(() => {
    console.log("SimpleHUD rendered with target word:", targetWord);
  }, [targetWord]);

  // Early return with error if no target word, but still render something visible
  if (!targetWord) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ pointerEvents: 'none' }}>
        <div className="bg-red-800 text-white p-6 rounded-lg text-xl font-bold">
          Error: No target word available
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-x-0 top-0 z-[9999] p-4"
      style={{ pointerEvents: 'none' }}
    >
      {/* Force to very high z-index to ensure it's on top of everything */}
      <div 
        className="bg-black bg-opacity-90 p-4 rounded-lg mx-auto max-w-3xl border-4 border-yellow-400 shadow-lg"
        style={{ transform: 'none', maxWidth: '800px', margin: '0 auto' }}
      >
        {/* Attention-grabbing pulse animation */}
        <div className="absolute inset-0 border-4 border-red-500 rounded-lg animate-pulse"></div>
        
        {/* Score and Time */}
        <div className="flex justify-between mb-4">
          <div className="text-3xl text-yellow-300 font-bold">Score: {score}</div>
          <div className="text-3xl text-red-400 font-bold">Time: {timeLeft}s</div>
        </div>
        
        {/* Game Status - Made very prominent */}
        <div className="text-center py-2 mb-4 bg-blue-900 rounded-lg">
          <div className="text-3xl text-white font-bold">{gameStatus}</div>
          {newLetterInfo && (
            <div className="text-xl text-yellow-300 mt-1 font-semibold">{newLetterInfo}</div>
          )}
        </div>
        
        {/* Target Word - Extra highlighted */}
        <div className="text-center bg-gray-900 p-4 rounded-lg border-2 border-yellow-500 mb-3">
          <div className="text-2xl mb-2 text-white font-bold">YOUR TARGET WORD:</div>
          <div className="text-4xl mb-2 text-cyan-300 font-extrabold">{targetWord}</div>
          
          {/* Progress boxes - Larger and more visible */}
          <div className="flex justify-center space-x-3 mt-2">
            {progress.split('').map((char, index) => (
              <div 
                key={index} 
                className={`w-16 h-16 flex items-center justify-center text-3xl border-4 
                  ${char === '_' 
                    ? 'border-gray-400 text-gray-400 bg-gray-800' 
                    : 'border-green-400 text-green-400 bg-green-900'}`}
              >
                {char !== '_' ? char : ''}
              </div>
            ))}
          </div>
        </div>
        
        {/* Clear Instructions */}
        <div className="text-center mt-2 p-3 bg-gray-800 rounded-lg border border-white">
          <div className="text-white text-lg font-bold">
            Click on letter blocks to spell &quot;{targetWord}&quot;
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleHUD;