"use client";

import { useState } from 'react';
import GameScreen from '@/components/GameScreen';
import StartScreen from '@/components/StartScreen';
import GameOverScreen from '@/components/GameOverScreen';

export default function Home() {
  // Game state management
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
  const [finalScore, setFinalScore] = useState(0);

  // Handle game state transitions
  const handleStartGame = () => {
    console.log("Starting game...");
    setGameState('playing');
  };

  const handleGameOver = (score: number) => {
    console.log(`Game over with score: ${score}`);
    setFinalScore(score);
    setGameState('gameOver');
  };

  const handleRestartGame = () => {
    console.log("Restarting game...");
    setGameState('playing');
  };

  return (
    <main className="w-screen h-screen overflow-hidden relative bg-black">
      {/* Render different screens based on game state */}
      {gameState === 'playing' && (
        <GameScreen onGameOver={handleGameOver} />
      )}
      
      {gameState === 'start' && (
        <StartScreen onStart={handleStartGame} />
      )}
      
      {gameState === 'gameOver' && (
        <GameOverScreen score={finalScore} onRestart={handleRestartGame} />
      )}
    </main>
  );
}