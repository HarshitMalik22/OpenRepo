'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function VideoDemo() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 1.7;
        }
    }, []);

    return (
        <section className="container mx-auto pb-16 md:pb-24 pt-0 relative z-20">


            <div className="relative w-full max-w-7xl mx-auto aspect-video rounded-2xl shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] border border-blue-500/30 bg-black/50 backdrop-blur-sm group">
                {/* Smoke/Glow Effects */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur-2xl opacity-10 group-hover:opacity-30 transition duration-1000 animate-pulse"></div>
                <div className="absolute -inset-8 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-600/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-20 transition duration-1000"></div>

                <div className="relative h-full w-full rounded-xl overflow-hidden bg-slate-900">
                    {/* Video */}
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        poster="/video-poster.jpg" // You might need to add a poster image later
                        autoPlay
                        loop
                        playsInline
                        muted
                    >
                        {/* TODO: Replace with your Cloudinary URL */}
                        <source src="https://res.cloudinary.com/drvqnu9dr/video/upload/v1764581492/OpenRepo-1764573920669_guxtiz.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </section>
    );
}
