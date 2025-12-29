"use client";

import React, { useEffect, useRef } from "react";

const WarpBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // Respect reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let isVisible = true;
        let stars: { x: number; y: number; z: number; pz: number }[] = [];

        // OPTIMIZED: Reduced star count (was 600, now 400)
        const starCount = 270;
        const speed = 0.1;
        const spread = 800;
        const depth = 1000;

        // Initialize stars
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * spread - spread / 2,
                y: Math.random() * spread - spread / 2,
                z: Math.random() * depth,
                pz: 0,
            });
        }

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        // OPTIMIZED: Cache gradient - create once, not every frame
        let cachedGradient: CanvasGradient | null = null;
        let lastCx = 0;
        let lastCy = 0;

        const getGradient = (cx: number, cy: number) => {
            if (cachedGradient && lastCx === cx && lastCy === cy) {
                return cachedGradient;
            }
            cachedGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 300);
            cachedGradient.addColorStop(0, "rgba(56, 189, 248, 0.2)");
            cachedGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
            lastCx = cx;
            lastCy = cy;
            return cachedGradient;
        };

        const draw = () => {
            // Don't animate if tab is not visible
            if (!isVisible) {
                animationFrameId = requestAnimationFrame(draw);
                return;
            }

            ctx.fillStyle = "#020617";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            // OPTIMIZED: Batch path operations
            ctx.beginPath();

            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];

                star.z -= speed * 25;

                if (star.z <= 0) {
                    star.z = depth;
                    star.x = Math.random() * spread - spread / 2;
                    star.y = Math.random() * spread - spread / 2;
                    star.pz = depth;
                }

                const k = 128.0 / star.z;
                const px = star.x * k + cx;
                const py = star.y * k + cy;

                const k_prev = 128.0 / (star.z + 20);
                const px_prev = star.x * k_prev + cx;
                const py_prev = star.y * k_prev + cy;

                if (
                    px >= 0 &&
                    px <= canvas.width &&
                    py >= 0 &&
                    py <= canvas.height &&
                    star.z < depth - 50
                ) {
                    const alpha = (1 - star.z / depth) * 1.5;

                    // Draw individual streaks (need separate strokes for varying alpha)
                    ctx.beginPath();
                    ctx.moveTo(px, py);
                    ctx.lineTo(px_prev, py_prev);
                    ctx.strokeStyle = `rgba(100, 200, 255, ${alpha})`;
                    ctx.lineWidth = alpha * 1.5;
                    ctx.stroke();
                }
            }

            // OPTIMIZED: Use cached gradient
            ctx.fillStyle = getGradient(cx, cy);
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            animationFrameId = requestAnimationFrame(draw);
        };

        // OPTIMIZED: Pause when tab is hidden
        const handleVisibilityChange = () => {
            isVisible = !document.hidden;
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        draw();

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
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