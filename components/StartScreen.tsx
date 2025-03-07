// components/StartScreen.tsx
import React from 'react';
import { Button } from "@/components/ui/button"; // Adjust based on your project structure

const StartScreen = () => {
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            // Trigger the start action here
            console.log("Start button pressed");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-purple-600 text-white">
            <h1 className="text-5xl font-bold mb-4">Welcome to Letter Range!</h1>
            <p className="text-xl mb-8">Learn English letters by shooting moving targets!</p>
            <Button 
                className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg transition duration-200 ease-in-out rounded-lg py-2 px-4"
                tabIndex={0} 
                onKeyDown={handleKeyDown}
                onClick={() => console.log("Start button clicked")} // Replace with actual start logic
            >
                Start Game
            </Button>
            <p className="mt-4 text-lg italic">This game is currently in development.</p>
        </div>
    );
};

export default StartScreen;