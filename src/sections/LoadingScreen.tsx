import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Progress bar animation
    tl.to(barRef.current, {
      width: '100%',
      duration: 1.5,
      ease: 'power2.inOut',
    });

    // Text scramble effect
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    const originalText = 'INITIALIZING';
    let iteration = 0;

    const interval = setInterval(() => {
      if (textRef.current) {
        textRef.current.innerText = originalText
          .split('')
          .map((_, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
      }

      if (iteration >= originalText.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);

    // Fade out content first, then animate panels
    tl.to(contentRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    }, "+=0.2");

    // Exit animation - panels slide out
    tl.to([leftPanelRef.current, rightPanelRef.current], {
      scaleX: 0,
      duration: 0.8,
      ease: 'power3.inOut',
      stagger: 0.1,
    }, "-=0.1");

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      {/* Unified Dark Background */}
      <div className="absolute inset-0 bg-[#050a1f]" />

      {/* Full width gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1535]/50 via-[#050a1f] to-[#1a0505]/50" />

      {/* Left Panel - for animation only, transparent */}
      <div
        ref={leftPanelRef}
        className="absolute left-0 top-0 w-1/2 h-full bg-[#050a1f] origin-left"
      />

      {/* Right Panel - for animation only, transparent */}
      <div
        ref={rightPanelRef}
        className="absolute right-0 top-0 w-1/2 h-full bg-[#050a1f] origin-right"
      />

      {/* Center Content */}
      <div ref={contentRef} className="relative z-10 flex flex-col items-center gap-8">
        {/* Loading Text */}
        <div
          ref={textRef}
          className="font-mono text-2xl md:text-4xl font-bold tracking-widest text-white drop-shadow-[0_0_20px_rgba(0,150,255,0.5)]"
        >
          INITIALIZING
        </div>

        {/* Progress Bar Container */}
        <div className="w-64 md:w-96 h-1 bg-white/10 rounded-full overflow-hidden">
          {/* Progress Bar */}
          <div
            ref={barRef}
            className="h-full w-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #0096ff 0%, #ff3232 100%)',
              boxShadow: '0 0 20px rgba(0, 150, 255, 0.5), 0 0 40px rgba(255, 50, 50, 0.3)',
            }}
          />
        </div>

        {/* Percentage */}
        <div className="font-mono text-sm text-gray-400">
          <span className="text-[#0096ff]">SYS</span>
          <span className="text-[#ff3232]">.BOOT</span>
          <span className="mx-2">|</span>
          <span className="animate-pulse">LOADING...</span>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-[#0096ff]/50" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-[#ff3232]/50" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-[#0096ff]/50" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-[#ff3232]/50" />
    </div>
  );
}
