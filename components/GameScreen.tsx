// File: components/GameScreen.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Crosshair from './Crosshair';
import SimpleHUD from './SimpleHUD';

// Type definitions
type GameScreenProps = {
  onGameOver: (score: number) => void;
};

type LetterTarget = {
  mesh: any; // Use type assertion for now
  letter: string;
  velocity: any; // Use type assertion for now
  createdAt?: number; // Add timestamp for age tracking
  row?: number; // Add row information for organization
};

// Constants
const GAME_DURATION = 60; // seconds
const TARGET_WORDS = ['CAT', 'DOG', 'RUN', 'JUMP', 'PLAY', 'FAST', 'SLOW', 'HAPPY', 'CODE', 'GAME'];
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ROW_COUNT = 3; // Number of rows for letter organization
const LETTER_SPEED = 0.02; // Reduced from 0.05 for slower movement

const GameScreen = ({ onGameOver }: GameScreenProps) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const raycasterRef = useRef<any>(new THREE.Raycaster());
  const mouseRef = useRef<any>(new THREE.Vector2());
  const targetsRef = useRef<LetterTarget[]>([]);
  const frameIdRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Game state
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [targetWord, setTargetWord] = useState('');
  const [progress, setProgress] = useState('');
  const [gameStatus, setGameStatus] = useState('Get Ready!');
  const [isInitialized, setIsInitialized] = useState(false); // Add state to track initialization
  const [isPaused, setIsPaused] = useState(false);
  const [newLetterInfo, setNewLetterInfo] = useState('');

  // Initialize game
  useEffect(() => {
    if (!containerRef.current) return;

    console.log("Initializing 3D scene...");
    
    try {
      // Check for WebGL support
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
          console.error("WebGL is not available in your browser");
          return;
        }
      } catch (e) {
        console.error("Error checking WebGL support:", e);
        return;
      }

      // Setup Three.js scene with shooting range background color
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1A1A2E); // Darker blue for indoor range
      scene.fog = new THREE.Fog(0x1A1A2E, 15, 50); // Add fog for depth
      sceneRef.current = scene;
      console.log("Scene created");

      // Setup camera
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 15;
      cameraRef.current = camera;
      console.log("Camera set up");

      // Setup renderer with error handling
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ 
          antialias: true,
          alpha: true,
          canvas: document.createElement('canvas') 
        });
        renderer.setClearColor(0x1A1A2E, 1);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Make sure previous canvas is removed if it exists
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
        
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;
        console.log("Renderer initialized");
      } catch (error) {
        console.error("Error creating WebGL renderer:", error);
        return;
      }
    } catch (error) {
      console.error("Error setting up 3D environment:", error);
      return;
    }

    // Add atmospheric lighting for shooting range
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    sceneRef.current.add(ambientLight);

    // Add spotlight from above like range lighting
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(0, 15, 5);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.3;
    spotLight.decay = 2;
    spotLight.distance = 50;
    spotLight.castShadow = true;
    sceneRef.current.add(spotLight);

    // Add some directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 5, 10);
    sceneRef.current.add(directionalLight);

    // Setup floor as shooting range floor
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorTexture = createRangeFloorTexture();
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      map: floorTexture,
      roughness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -5;
    sceneRef.current.add(floor);

    // Add back wall of shooting range with target patterns
    const backWallGeometry = new THREE.PlaneGeometry(100, 30);
    const backWallTexture = createRangeBackWallTexture();
    const backWallMaterial = new THREE.MeshStandardMaterial({ 
      map: backWallTexture, 
      roughness: 0.7 
    });
    const backWall = new THREE.Mesh(backWallGeometry, backWallMaterial);
    backWall.position.z = -25;
    backWall.position.y = 10;
    sceneRef.current.add(backWall);

    // Add side walls
    const sideWallGeometry = new THREE.PlaneGeometry(50, 30);
    const sideWallMaterial = new THREE.MeshStandardMaterial({ color: 0x333344 });
    
    // Left wall
    const leftWall = new THREE.Mesh(sideWallGeometry, sideWallMaterial);
    leftWall.position.x = -50;
    leftWall.position.y = 10;
    leftWall.position.z = -10;
    leftWall.rotation.y = Math.PI / 2;
    sceneRef.current.add(leftWall);
    
    // Right wall
    const rightWall = new THREE.Mesh(sideWallGeometry, sideWallMaterial);
    rightWall.position.x = 50;
    rightWall.position.y = 10;
    rightWall.position.z = -10;
    rightWall.rotation.y = -Math.PI / 2;
    sceneRef.current.add(rightWall);

    // Add range dividers
    for (let i = -3; i <= 3; i += 2) {
      if (i === 0) continue; // Skip center divider
      
      const dividerGeometry = new THREE.BoxGeometry(0.5, 10, 20);
      const dividerMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
      const divider = new THREE.Mesh(dividerGeometry, dividerMaterial);
      divider.position.x = i * 7;
      divider.position.y = 0;
      divider.position.z = -15;
      sceneRef.current.add(divider);
    }

    // Add some static targets in the background
    addStaticTargets();

    // Initialize a random target word
    const newTargetWord = TARGET_WORDS[Math.floor(Math.random() * TARGET_WORDS.length)];
    setTargetWord(newTargetWord);
    setProgress('_'.repeat(newTargetWord.length));

    // Start the announcement
    announceTargetWord(newTargetWord);
    
    // Set initialization flag
    setIsInitialized(true);

    // Start spawning targets - with a longer interval for easier gameplay
    const spawnInterval = setInterval(() => {
      spawnLetterTarget();
    }, 1200); // Increased from 800ms for slower spawning

    // Setup game timer
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          clearInterval(spawnInterval);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      try {
        // Update target positions
        updateTargets();
        
        // Render the scene
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        } else {
          console.warn("Renderer, scene, or camera not available for rendering");
        }
      } catch (error) {
        console.error("Error in animation loop:", error);
      }
    };
    
    console.log("Starting animation loop");
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(timerInterval);
      clearInterval(spawnInterval);
      cancelAnimationFrame(frameIdRef.current);
      
      if (rendererRef.current && containerRef.current) {
        try {
          containerRef.current.removeChild(rendererRef.current.domElement);
        } catch (error) {
          console.error("Error removing renderer:", error);
        }
      }
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [onGameOver]);

  // Create texture for shooting range floor
  const createRangeFloorTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    
    if (context) {
      // Base floor color
      context.fillStyle = '#333333';
      context.fillRect(0, 0, 512, 512);
      
      // Add grid lines
      context.strokeStyle = '#444444';
      context.lineWidth = 2;
      
      // Horizontal grid lines
      for (let i = 0; i < 512; i += 64) {
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(512, i);
        context.stroke();
      }
      
      // Vertical grid lines
      for (let i = 0; i < 512; i += 64) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, 512);
        context.stroke();
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    return texture;
  };

  // Create texture for shooting range back wall
  const createRangeBackWallTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    
    if (context) {
      // Base wall color
      context.fillStyle = '#222222';
      context.fillRect(0, 0, 1024, 512);
      
      // Draw some target patterns
      for (let i = 0; i < 5; i++) {
        const x = 100 + i * 200;
        const y = 256;
        const radius = 80;
        
        // Outer ring
        context.fillStyle = '#333333';
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
        
        // Middle ring
        context.fillStyle = '#444444';
        context.beginPath();
        context.arc(x, y, radius * 0.7, 0, Math.PI * 2);
        context.fill();
        
        // Inner ring
        context.fillStyle = '#555555';
        context.beginPath();
        context.arc(x, y, radius * 0.4, 0, Math.PI * 2);
        context.fill();
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  };

  // Add static targets to the background
  const addStaticTargets = () => {
    if (!sceneRef.current) return;
    
    // Create a few static targets at various depths
    for (let i = 0; i < 8; i++) {
      const targetGeometry = new THREE.CircleGeometry(1.5, 32);
      
      // Create concentric circles for target
      const targetCanvas = document.createElement('canvas');
      targetCanvas.width = 256;
      targetCanvas.height = 256;
      const context = targetCanvas.getContext('2d');
      
      if (context) {
        // Outer ring
        context.fillStyle = 'white';
        context.beginPath();
        context.arc(128, 128, 128, 0, Math.PI * 2);
        context.fill();
        
        // Middle ring
        context.fillStyle = 'black';
        context.beginPath();
        context.arc(128, 128, 96, 0, Math.PI * 2);
        context.fill();
        
        // Inner ring
        context.fillStyle = 'red';
        context.beginPath();
        context.arc(128, 128, 32, 0, Math.PI * 2);
        context.fill();
      }
      
      const targetTexture = new THREE.CanvasTexture(targetCanvas);
      const targetMaterial = new THREE.MeshStandardMaterial({ map: targetTexture });
      const target = new THREE.Mesh(targetGeometry, targetMaterial);
      
      // Position at various locations and depths
      target.position.x = (Math.random() - 0.5) * 30;
      target.position.y = Math.random() * 5 + 0;
      target.position.z = -20 - Math.random() * 10;
      
      sceneRef.current.add(target);
    }
  };

  // Handle shooting
  const handleShoot = (event: React.MouseEvent) => {
    if (!sceneRef.current || !cameraRef.current) return;

    // Update mouse position for raycaster
    mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    // Check for intersections with targets
    const intersects = raycasterRef.current.intersectObjects(
      targetsRef.current.map(target => target.mesh)
    );

    if (intersects.length > 0) {
      const hitObject = intersects[0].object as any;
      const targetIndex = targetsRef.current.findIndex(t => t.mesh === hitObject);
      
      if (targetIndex !== -1) {
        const hitLetter = targetsRef.current[targetIndex].letter;
        handleLetterHit(hitLetter);
        
        // Remove the hit target
        if (sceneRef.current) {
          sceneRef.current.remove(hitObject);
        }
        targetsRef.current.splice(targetIndex, 1);
      }
    }
  };

  // Handle when a letter is hit
  const handleLetterHit = (letter: string) => {
    // Check if the letter is part of the target word
    const nextLetterIndex = progress.indexOf('_');
    
    if (nextLetterIndex !== -1 && targetWord[nextLetterIndex] === letter) {
      // Correct letter
      const newProgress = progress.split('');
      newProgress[nextLetterIndex] = letter;
      const updatedProgress = newProgress.join('');
      setProgress(updatedProgress);
      
      playSound('correct');
      setScore(prev => prev + 100);
      setGameStatus('Good shot!');

      // Check if word is complete
      if (!updatedProgress.includes('_')) {
        // Word complete - celebration status
        setGameStatus(`Great job! +500 points!`);
        
        // Keep the success message visible longer (3 seconds) before moving to next word
        setTimeout(() => {
          const newTargetWord = TARGET_WORDS[Math.floor(Math.random() * TARGET_WORDS.length)];
          setTargetWord(newTargetWord);
          setProgress('_'.repeat(newTargetWord.length));
          announceTargetWord(newTargetWord);
          setScore(prev => prev + 500); // Bonus for completing a word
        }, 3000);
      }
    } else {
      // Wrong letter
      playSound('wrong');
      setGameStatus('Wrong letter!');
      setScore(prev => Math.max(0, prev - 20));
    }
  };

  // No duplicate declaration here

  // UPDATED: Spawn letter targets with pause for visibility
  const spawnLetterTarget = () => {
    if (!sceneRef.current || isPaused) return;

    // Create a random letter
    const letter = LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
    
    // Create the letter geometry
    const geometry = new THREE.BoxGeometry(2, 2, 0.5);
    
    // Create letter texture with a highlight color
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    
    if (context) {
      // Brighter color for better visibility
      context.fillStyle = '#44AAFF'; // Brighter blue
      context.fillRect(0, 0, 128, 128);
      
      // Add a highlight border
      context.strokeStyle = '#FFFF00'; // Yellow border
      context.lineWidth = 10;
      context.strokeRect(5, 5, 118, 118);
      
      context.font = 'bold 80px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = 'white';
      context.fillText(letter, 64, 64);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    
    // Assign to a specific row (0, 1, or 2)
    const row = Math.floor(Math.random() * ROW_COUNT);
    
    // Position based on row
    // Row 0 (top) at y=5, Row 1 (middle) at y=2, Row 2 (bottom) at y=-1
    const rowPositions = [5, 2, -1]; 
    
    // Position at a fixed height based on row and fixed depth
    mesh.position.x = Math.random() > 0.5 ? 15 : -15; // Start from either left or right side
    mesh.position.y = rowPositions[row];
    mesh.position.z = -10; // Fixed depth
    
    // Set velocity only on X-axis (left-right movement)
    const velocity = new THREE.Vector3(
      mesh.position.x > 0 ? -LETTER_SPEED : LETTER_SPEED, // Move toward the center
      0, // No vertical movement
      0  // No depth movement
    );
    
    // Add to scene and targets array
    sceneRef.current.add(mesh);
    targetsRef.current.push({ 
      mesh, 
      letter, 
      velocity,
      createdAt: Date.now(),
      row // Store the row information
    });
    
    // Pause the game to display the new letter
    setIsPaused(true);
    
    // Update game status to show the new letter
    setGameStatus(`New Letter: ${letter}`);
    setNewLetterInfo(`Row: ${row + 1} (${mesh.position.x > 0 ? 'Right' : 'Left'} side)`);
    
    // Resume the game after 5 seconds
    setTimeout(() => {
      setIsPaused(false);
      setNewLetterInfo('');
      setGameStatus(targetWord ? `Shoot: ${targetWord}!` : 'Get Ready!');
    }, 5000);
  };

  // UPDATED: Update targets with row-based movement and pause functionality
  const updateTargets = () => {
    // Skip updates if the game is paused
    if (isPaused) return;
    
    // Move all targets
    targetsRef.current.forEach(target => {
      target.mesh.position.add(target.velocity);
      target.mesh.rotation.y += 0.01; // Only rotate around Y axis for better visibility
      
      // Bounce when reaching center or edges
      if (
        (target.velocity.x > 0 && target.mesh.position.x > 14) ||
        (target.velocity.x < 0 && target.mesh.position.x < -14)
      ) {
        target.velocity.x *= -1; // Reverse direction
      }
    });
    
    // Remove targets that are too old (20 seconds for even easier gameplay)
    const now = Date.now();
    targetsRef.current = targetsRef.current.filter(target => {
      if (target.createdAt && now - target.createdAt > 20000) {
        if (sceneRef.current) {
          sceneRef.current.remove(target.mesh);
        }
        return false;
      }
      return true;
    });
  };

  // Audio functions
  const playSound = (type: 'correct' | 'wrong' | 'announcement') => {
    // In a real game, we would play actual sounds here
    console.log(`Playing ${type} sound`);
  };

  const announceTargetWord = (word: string) => {
    setGameStatus(`Shoot: ${word}!`);
    playSound('announcement');
  };

  // End the game
  const endGame = () => {
    // Set a final game status
    setGameStatus('Game Over! Final Score: ' + score);
    
    // Keep the HUD visible for a few seconds (5 seconds) before transitioning
    setTimeout(() => {
      onGameOver(score);
    }, 5000);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden" ref={containerRef} onClick={handleShoot}>
      {/* Three.js canvas container */}
      <div className="absolute inset-0 z-0">
        {/* Three.js will render here */}
      </div>
      
      {/* HUD Components - Increased z-index values and forcing display */}
      {isInitialized && (
        <div className="fixed inset-0 z-[9000] pointer-events-none" style={{ pointerEvents: 'none' }}>
          <SimpleHUD 
            targetWord={targetWord}
            progress={progress}
            score={score}
            timeLeft={timeLeft}
            gameStatus={gameStatus}
            newLetterInfo={newLetterInfo}
          />
          <Crosshair />
          
          {/* Debug HUD - For testing */}
          <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 p-2 rounded text-white text-sm">
            <div>Target: {targetWord || "No target word!"}</div>
            <div>Progress: {progress || "No progress!"}</div>
            <div>Status: {gameStatus}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;