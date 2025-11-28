"use client";

import React, { useEffect, useRef } from "react";

const WarpBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let stars: { x: number; y: number; z: number; pz: number }[] = [];

        // Configuration matches the "blue/cyan" vibe of your image
        const starCount = 1000;
        const speed = 0.1;
        const spread = 800; // How wide the tunnel is
        const depth = 1000; // How deep the tunnel is

        // Initialize stars
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * spread - spread / 2,
                y: Math.random() * spread - spread / 2,
                z: Math.random() * depth,
                pz: 0, // Previous Z (for trail calculation)
            });
        }

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const draw = () => {
            // Clear canvas with a slight fade for trail effect, or solid for crisp lines
            // Using solid dark blue/black background to match your image
            ctx.fillStyle = "#020617"; // Dark Slate/Black
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Center of screen
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            stars.forEach((star) => {
                // Update Z position (move towards screen)
                star.z -= speed * 25; // Speed multiplier

                // Reset star if it passes the screen
                if (star.z <= 0) {
                    star.z = depth;
                    star.x = Math.random() * spread - spread / 2;
                    star.y = Math.random() * spread - spread / 2;
                    star.pz = depth;
                }

                // Project 3D coordinates to 2D screen space
                const k = 128.0 / star.z;
                const px = star.x * k + cx;
                const py = star.y * k + cy;

                // Calculate previous position for "streak" effect (Warp lines)
                // We use a slightly larger Z for the tail of the streak
                const k_prev = 128.0 / (star.z + 20);
                const px_prev = star.x * k_prev + cx;
                const py_prev = star.y * k_prev + cy;

                if (
                    px >= 0 &&
                    px <= canvas.width &&
                    py >= 0 &&
                    py <= canvas.height &&
                    star.z < depth - 50 // Don't draw brand new stars immediately to avoid popping
                ) {
                    // Calculate brightness based on depth (closer = brighter)
                    const alpha = (1 - star.z / depth) * 1.5;

                    // Draw the streak
                    ctx.beginPath();
                    ctx.moveTo(px, py);
                    ctx.lineTo(px_prev, py_prev);

                    // Color: Cyan/Blue mix to match your reference image
                    ctx.strokeStyle = `rgba(100, 200, 255, ${alpha})`;
                    ctx.lineWidth = alpha * 1.5; // Closer stars are thicker
                    ctx.stroke();
                }
            });

            // Add a glowing center burst (optional, matches the bright center in your image)
            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 300);
            gradient.addColorStop(0, "rgba(56, 189, 248, 0.2)"); // Light Blue center
            gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        draw();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-0 opacity-90 pointer-events-none"
        />
    );
};

export default WarpBackground;