import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      // Entrance animations - start after loading screen
      const tl = gsap.timeline({ delay: 2.5 });

      // Make content visible first
      tl.set(contentRef.current, { visibility: 'visible' });

      // Portrait entrance
      tl.fromTo(
        portraitRef.current,
        { scale: 0, rotation: 180, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }
      );

      // Name reveal - split text effect
      tl.fromTo(
        nameRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      );

      // Subtitle typing effect
      tl.fromTo(
        subtitleRef.current,
        { width: 0, opacity: 0 },
        { width: 'auto', opacity: 1, duration: 1, ease: 'steps(30)' },
        '-=0.2'
      );

      // Description fade in
      tl.fromTo(
        descRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.5'
      );

      // CTA button
      tl.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      );

    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToTechStack = () => {
    const element = document.getElementById('tech-stack');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050a1f] via-[#0a1535] to-[#1a0505]" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl px-4 sm:px-6 py-12 sm:py-16 md:py-20"
        style={{ visibility: 'hidden' }}
      >
        {/* Portrait */}
        <div
          ref={portraitRef}
          className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 mb-6 sm:mb-8"
        >
          {/* Outer glow ring - behind the image */}
          <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-[#0096ff]/20 to-[#ff3232]/20 blur-2xl animate-pulse" />
          
          {/* Middle glow ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#0096ff]/30 to-[#ff3232]/30 blur-lg" />
          
          {/* Border gradient ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0096ff] to-[#ff3232] animate-pulse-glow" />
          
          {/* Image container */}
          <div className="absolute inset-[2px] rounded-full overflow-hidden bg-[#050a1f]">
            <img
              src="/portrait.jpeg"
              alt="Shayan Ali"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>

        {/* Name - Split Typography */}
        <h1
          ref={nameRef}
          className="font-heading text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-3 sm:mb-4 tracking-tight"
        >
          <span className="bg-gradient-to-r from-[#0096ff] to-[#33abff] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,150,255,0.5)]">SHAYAN</span>
          <span className="text-white/40 mx-1 sm:mx-2">//</span>
          <span className="bg-gradient-to-r from-[#ff5555] to-[#ff3232] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,50,50,0.5)]">ALI</span>
        </h1>

        {/* Subtitle - Typing Effect */}
        <p
          ref={subtitleRef}
          className="font-mono text-sm sm:text-base md:text-lg lg:text-xl text-blue-200/80 mb-4 sm:mb-6 overflow-hidden whitespace-nowrap border-r-2 border-[#0096ff] animate-typing px-2"
        >
          Full Stack Architect // Security Operator
        </p>

        {/* Description */}
        <p
          ref={descRef}
          className="max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl text-sm sm:text-base md:text-lg text-gray-300/80 mb-8 sm:mb-10 leading-relaxed px-2"
        >
          Bridging the gap between pixel-perfect design and kernel-level security.
          I craft digital experiences that are both beautiful and bulletproof.
        </p>

        {/* CTA Button */}
        <button
          ref={ctaRef}
          onClick={scrollToTechStack}
          className="group relative px-6 sm:px-8 py-3 sm:py-4 font-mono text-xs sm:text-sm tracking-wider overflow-hidden rounded-full btn-gradient"
        >
          <span className="relative z-10 flex items-center gap-2 sm:gap-3 text-white font-semibold">
            <span>INITIALIZE SEQUENCE</span>
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 animate-bounce" />
          </span>
        </button>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-[#050a1f] to-transparent pointer-events-none" />
    </section>
  );
}
