import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Code2, Terminal, Layers, Shield, Cpu, Database, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function PortalsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<'architect' | 'operator' | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (!section || !cards) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        '.portals-title',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards entrance
      const cardElements = cards.querySelectorAll('.portal-card');
      gsap.fromTo(
        cardElements,
        { y: 100, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.2,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-20 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050a1f] via-[#0a0f2e] to-[#050a1f]" />

      {/* Section Title */}
      <div className="portals-title text-center mb-16 px-6 relative z-10">
        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
          <span className="text-white">CHOOSE YOUR</span>
          <span className="bg-gradient-to-r from-[#0096ff] to-[#ff3232] bg-clip-text text-transparent"> PATH</span>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Select the portal that aligns with your needs
        </p>
      </div>

      {/* Cards Container */}
      <div
        ref={cardsRef}
        className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10"
      >
        {/* Architect Portal Card */}
        <div
          className="portal-card group relative"
          onMouseEnter={() => setHoveredCard('architect')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <a
            href="https://architect-portfolio.example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block relative h-full"
          >
            {/* Card Container */}
            <div className="relative rounded-3xl overflow-hidden border border-[#0096ff]/30 group-hover:border-[#0096ff]/60 transition-all duration-500 hover:shadow-[0_0_60px_rgba(0,150,255,0.2)] bg-gradient-to-br from-[#0a1535] to-[#050a1f]">
              {/* Top Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0096ff] to-transparent opacity-50" />
              
              {/* Animated Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#0096ff]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-[#0096ff]/5 rounded-full blur-2xl" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-8 md:p-10">
                {/* Header with Icon */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0096ff]/30 to-[#0096ff]/5 flex items-center justify-center border border-[#0096ff]/40 group-hover:border-[#0096ff]/60 transition-all group-hover:scale-110 duration-300">
                      <Code2 className="w-8 h-8 text-[#0096ff]" />
                    </div>
                    <div>
                      <p className="text-[#0096ff] font-mono text-sm mb-1">PORTFOLIO 01</p>
                      <h3 className="font-heading text-2xl md:text-3xl font-bold text-white">
                        THE ARCHITECT
                      </h3>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <ExternalLink className="w-6 h-6 text-[#0096ff] opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Full Stack Development & UI/UX Design. Building high-performance web applications 
                  with pixel-perfect interfaces and modern technologies.
                </p>

                {/* Tech Stack Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0096ff]/5 border border-[#0096ff]/10">
                    <Layers className="w-5 h-5 text-[#0096ff]" />
                    <span className="text-gray-300 text-sm">React & Next.js</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0096ff]/5 border border-[#0096ff]/10">
                    <Globe className="w-5 h-5 text-[#0096ff]" />
                    <span className="text-gray-300 text-sm">UI/UX Design</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0096ff]/5 border border-[#0096ff]/10">
                    <Database className="w-5 h-5 text-[#0096ff]" />
                    <span className="text-gray-300 text-sm">Backend APIs</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0096ff]/5 border border-[#0096ff]/10">
                    <Cpu className="w-5 h-5 text-[#0096ff]" />
                    <span className="text-gray-300 text-sm">Performance</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between pt-6 border-t border-[#0096ff]/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0096ff] animate-pulse"></span>
                    <span className="text-gray-500 text-sm">Available for projects</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#0096ff] font-mono text-sm group-hover:gap-4 transition-all">
                    <span>Explore</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Operator Portal Card */}
        <div
          className="portal-card group relative"
          onMouseEnter={() => setHoveredCard('operator')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <a
            href="https://operator-portfolio.example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block relative h-full"
          >
            {/* Card Container */}
            <div className="relative rounded-3xl overflow-hidden border border-[#ff3232]/30 group-hover:border-[#ff3232]/60 transition-all duration-500 hover:shadow-[0_0_60px_rgba(255,50,50,0.2)] bg-gradient-to-br from-[#1a0505] to-[#0d0303]">
              {/* Top Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff3232] to-transparent opacity-50" />
              
              {/* Animated Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-1/4 left-0 w-64 h-64 bg-[#ff3232]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-0 w-48 h-48 bg-[#ff3232]/5 rounded-full blur-2xl" />
              </div>

              {/* Matrix Rain Effect (on hover) */}
              {hoveredCard === 'operator' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                  <MatrixRain />
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 p-8 md:p-10">
                {/* Header with Icon */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#ff3232]/30 to-[#ff3232]/5 flex items-center justify-center border border-[#ff3232]/40 group-hover:border-[#ff3232]/60 transition-all group-hover:scale-110 duration-300">
                      <Terminal className="w-8 h-8 text-[#ff3232]" />
                    </div>
                    <div>
                      <p className="text-[#ff3232] font-mono text-sm mb-1">PORTFOLIO 02</p>
                      <h3 className="font-heading text-2xl md:text-3xl font-bold text-white font-mono">
                        THE OPERATOR
                      </h3>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <ExternalLink className="w-6 h-6 text-[#ff3232] opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 mb-8 leading-relaxed font-mono text-sm">
                  {`> Offensive Security & Low-Level Engineering`}<br />
                  {`> Secure systems from kernel to cloud`}<br />
                  {`> Penetration testing & vulnerability assessment`}
                </p>

                {/* Tech Stack Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#ff3232]/5 border border-[#ff3232]/10">
                    <Shield className="w-5 h-5 text-[#ff3232]" />
                    <span className="text-gray-300 text-sm font-mono">Penetration Testing</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#ff3232]/5 border border-[#ff3232]/10">
                    <Terminal className="w-5 h-5 text-[#ff3232]" />
                    <span className="text-gray-300 text-sm font-mono">Linux Systems</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#ff3232]/5 border border-[#ff3232]/10">
                    <Cpu className="w-5 h-5 text-[#ff3232]" />
                    <span className="text-gray-300 text-sm font-mono">Kernel Dev</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#ff3232]/5 border border-[#ff3232]/10">
                    <Database className="w-5 h-5 text-[#ff3232]" />
                    <span className="text-gray-300 text-sm font-mono">Blockchain</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between pt-6 border-t border-[#ff3232]/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ff3232] animate-pulse"></span>
                    <span className="text-gray-500 text-sm font-mono">{`status: active`}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#ff3232] font-mono text-sm group-hover:gap-4 transition-all">
                    <span>{`> Access`}</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Scanline Effect */}
              <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="absolute inset-0 scanlines" />
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0096ff]/30 to-[#ff3232]/30 to-transparent" />
    </section>
  );
}

// Matrix Rain Component
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    let animationId: number;

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ff3232';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}
