"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const WarpBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { resolvedTheme } = useTheme();

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

        // Colors based on theme
        const isDark = resolvedTheme === 'dark';
        const bgColor = isDark ? "#020617" : "#ffffff";
        const starColor = isDark ? "100, 200, 255" : "30, 41, 59"; // Light blue vs slate-800
        const gradientColor = isDark ? "rgba(56, 189, 248, 0.2)" : "rgba(14, 165, 233, 0.1)";

        const getGradient = (cx: number, cy: number) => {
            if (cachedGradient && lastCx === cx && lastCy === cy) {
                return cachedGradient;
            }
            cachedGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 300);
            cachedGradient.addColorStop(0, gradientColor);
            cachedGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
            lastCx = cx;
            lastCy = cy;
            return cachedGradient;
        };

        // Pre-compute alpha buckets for batching
        const alphaBuckets: { stars: typeof stars; alpha: number; lineWidth: number }[] = [
            { stars: [], alpha: 0.3, lineWidth: 0.45 },
            { stars: [], alpha: 0.6, lineWidth: 0.9 },
            { stars: [], alpha: 0.9, lineWidth: 1.35 },
            { stars: [], alpha: 1.2, lineWidth: 1.8 },
        ];

        const draw = () => {
            // Don't animate if tab is not visible
            if (!isVisible) {
                animationFrameId = requestAnimationFrame(draw);
                return;
            }

            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            // Clear buckets
            for (const bucket of alphaBuckets) {
                bucket.stars = [];
            }

            // Update stars and sort into alpha buckets
            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];

                star.z -= speed * 25;

                if (star.z <= 0) {
                    star.z = depth;
                    star.x = Math.random() * spread - spread / 2;
                    star.y = Math.random() * spread - spread / 2;
                    star.pz = depth;
                }

                if (star.z < depth - 50) {
                    const alpha = (1 - star.z / depth) * 1.5;
                    // Sort into bucket based on alpha
                    const bucketIndex = Math.min(3, Math.floor(alpha / 0.4));
                    alphaBuckets[bucketIndex].stars.push(star);
                }
            }

            // OPTIMIZED: Draw stars in batches by alpha level (fewer state changes)
            for (const bucket of alphaBuckets) {
                if (bucket.stars.length === 0) continue;

                ctx.beginPath();
                ctx.strokeStyle = `rgba(${starColor}, ${bucket.alpha})`;
                ctx.lineWidth = bucket.lineWidth;

                for (const star of bucket.stars) {
                    const k = 128.0 / star.z;
                    const px = star.x * k + cx;
                    const py = star.y * k + cy;

                    const k_prev = 128.0 / (star.z + 20);
                    const px_prev = star.x * k_prev + cx;
                    const py_prev = star.y * k_prev + cy;

                    if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
                        ctx.moveTo(px, py);
                        ctx.lineTo(px_prev, py_prev);
                    }
                }
                ctx.stroke();
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
    }, [resolvedTheme]); // Re-run when theme changes

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-0 opacity-90 pointer-events-none"
        />
    );
};

export default WarpBackground;