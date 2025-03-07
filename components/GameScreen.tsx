// components/GameScreen.tsx
'use client';

import React, { useEffect } from 'react';
import * as THREE from 'three';

const GameScreen = () => {
    useEffect(() => {
        // Set up the 3D scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Add lights
        const light = new THREE.AmbientLight(0xffffff); // soft white light
        scene.add(light);

        // Create moving targets (spheres)
        const createTarget = () => {
            const geometry = new THREE.SphereGeometry(1, 32, 32);
            const material = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // yellow
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, -10);
            scene.add(sphere);
            return sphere;
        };

        const targets = Array.from({ length: 5 }, createTarget); // Create 5 targets

        // Crosshair setup
        const crosshair = document.createElement('div');
        crosshair.style.position = 'absolute';
        crosshair.style.width = '10px';
        crosshair.style.height = '10px';
        crosshair.style.backgroundColor = 'red';
        crosshair.style.pointerEvents = 'none';
        document.body.appendChild(crosshair);

        // Mouse movement
        const onMouseMove = (event: MouseEvent) => {
            crosshair.style.left = `${event.clientX}px`;
            crosshair.style.top = `${event.clientY}px`;
        };

        // Shooting logic
        const onClick = () => {
            // Logic to check if a target is hit
            console.log('Shoot!');
        };

        // Event listeners
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('click', onClick);

        // Add keyboard controls
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                onClick(); // Call the shooting logic
            }
        };

        // Event listener for keydown
        window.addEventListener('keydown', onKeyDown);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('click', onClick);
            window.removeEventListener('keydown', onKeyDown); // Clean up keydown listener
            document.body.removeChild(crosshair);
            // Clean up Three.js objects here
        };
    }, []);

    // HUD Implementation
    const hud = (
        <div className="hud fixed top-0 left-0 p-4">
            <div className="text-white">Target Word: A</div>
            <div className="text-white">Score: 0</div>
            <div className="text-white">Progress: 0%</div>
            <div className="text-white">Timer: 60</div>
        </div>
    );

    return (
        <div>
            {hud}
            {/* Existing Three.js canvas rendering code */}
        </div>
    );
};

export default GameScreen;