"use client";

import { ReactNode } from "react";

// PERFORMANCE: Lenis smooth scrolling disabled - it runs requestAnimationFrame
// continuously even when not scrolling, consuming CPU/GPU resources.
// Native browser scroll is much more efficient.
// To re-enable, uncomment the useEffect below.

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
    // useEffect(() => {
    //     const lenis = new Lenis({
    //         duration: 0.5,
    //         easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    //         orientation: "vertical",
    //         gestureOrientation: "vertical",
    //         smoothWheel: true,
    //         wheelMultiplier: 1,
    //         touchMultiplier: 2,
    //     });

    //     function raf(time: number) {
    //         lenis.raf(time);
    //         requestAnimationFrame(raf);
    //     }

    //     requestAnimationFrame(raf);

    //     return () => {
    //         lenis.destroy();
    //     };
    // }, []);

    return <>{children}</>;
}
