import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Code2, 
  Layers, 
  Server, 
  FileType, 
  Palette,
  Shield,
  Terminal,
  Cpu,
  Database,
  Binary
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const architectTechs = [
  { name: 'React.js', icon: Code2, level: 95 },
  { name: 'Next.js', icon: Layers, level: 90 },
  { name: 'Node.js', icon: Server, level: 88 },
  { name: 'TypeScript', icon: FileType, level: 92 },
  { name: 'Tailwind CSS', icon: Palette, level: 95 },
];

const operatorTechs = [
  { name: 'Offensive Security', icon: Shield, level: 90 },
  { name: 'Arch Linux', icon: Terminal, level: 88 },
  { name: 'Kernel Optimization', icon: Cpu, level: 85 },
  { name: 'Bash Scripting', icon: Binary, level: 92 },
  { name: 'Blockchain', icon: Database, level: 80 },
];

export default function TechStackSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const divider = dividerRef.current;
    const title = titleRef.current;
    if (!section || !left || !right || !divider || !title) return;

    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(left, { x: '-100%', opacity: 0 });
      gsap.set(right, { x: '100%', opacity: 0 });
      gsap.set(divider, { scaleY: 0, opacity: 0 });
      gsap.set(title, { y: 50, opacity: 0 });

      // Create scroll-triggered animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
        },
      });

      // Title entrance
      tl.to(title, {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });

      // Panels slide in
      tl.to(
        left,
        {
          x: '0%',
          opacity: 1,
          duration: 0.4,
          ease: 'power3.out',
        },
        '-=0.2'
      );

      tl.to(
        right,
        {
          x: '0%',
          opacity: 1,
          duration: 0.4,
          ease: 'power3.out',
        },
        '<'
      );

      // Divider grows
      tl.to(
        divider,
        {
          scaleY: 1,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        },
        '-=0.2'
      );

      // Tech cards stagger animation
      const leftCards = left.querySelectorAll('.tech-card');
      const rightCards = right.querySelectorAll('.tech-card');

      gsap.fromTo(
        leftCards,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        rightCards,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 50%',
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
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050a1f] via-[#0a0f2e] to-[#050a1f]" />

      {/* Section Title */}
      <div ref={titleRef} className="text-center mb-16 px-6 relative z-10">
        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-[#0096ff] to-[#33abff] bg-clip-text text-transparent">TECH</span>
          <span className="text-white/30 mx-2"> // </span>
          <span className="bg-gradient-to-r from-[#ff5555] to-[#ff3232] bg-clip-text text-transparent">STACK</span>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Dual expertise spanning modern web development and deep systems engineering
        </p>
      </div>

      {/* Split Container */}
      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 relative">
          {/* Left Side - Architect */}
          <div
            ref={leftRef}
            className="relative p-8 lg:p-12"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1535]/80 to-transparent rounded-3xl border border-[#0096ff]/20" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#0096ff]/20 to-[#0096ff]/5 border border-[#0096ff]/30">
                  <Code2 className="w-8 h-8 text-[#0096ff]" />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white">
                    THE ARCHITECT
                  </h3>
                  <p className="text-[#0096ff] text-sm font-mono">
                    Building the Interface
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {architectTechs.map((tech, index) => {
                  const Icon = tech.icon;
                  return (
                    <div
                      key={tech.name}
                      className="tech-card group relative p-4 rounded-xl bg-[#0a1535]/60 border border-[#0096ff]/20 hover:border-[#0096ff]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,150,255,0.2)]"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-[#0096ff]/10 group-hover:bg-[#0096ff]/20 transition-colors">
                          <Icon className="w-5 h-5 text-[#0096ff]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">{tech.name}</span>
                            <span className="text-[#0096ff] font-mono text-sm">
                              {tech.level}%
                            </span>
                          </div>
                          {/* Progress Bar */}
                          <div className="h-1.5 bg-[#050a1f] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#0096ff] to-[#33abff] rounded-full transition-all duration-1000 group-hover:shadow-[0_0_10px_rgba(0,150,255,0.5)]"
                              style={{ width: `${tech.level}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Center Divider */}
          <div
            ref={dividerRef}
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 origin-top"
            style={{
              background: 'linear-gradient(180deg, #0096ff 0%, #ff3232 100%)',
            }}
          >
            {/* Glowing Nodes */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#0096ff] shadow-[0_0_15px_#0096ff] animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-[#0096ff] to-[#ff3232] shadow-[0_0_20px_rgba(0,150,255,0.5)] animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-3/4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#ff3232] shadow-[0_0_15px_#ff3232] animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          {/* Mobile Divider */}
          <div
            className="lg:hidden h-px w-full my-8"
            style={{
              background: 'linear-gradient(90deg, #0096ff 0%, #ff3232 100%)',
            }}
          />

          {/* Right Side - Operator */}
          <div
            ref={rightRef}
            className="relative p-8 lg:p-12"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-l from-[#1a0505]/80 to-transparent rounded-3xl border border-[#ff3232]/20" />
            
            {/* Scanlines Overlay */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none opacity-20">
              <div className="absolute inset-0 scanlines" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#ff3232]/20 to-[#ff3232]/5 border border-[#ff3232]/30">
                  <Shield className="w-8 h-8 text-[#ff3232]" />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white font-mono">
                    THE_OPERATOR
                  </h3>
                  <p className="text-[#ff3232] text-sm font-mono">
                    Securing the Foundation
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {operatorTechs.map((tech, index) => {
                  const Icon = tech.icon;
                  return (
                    <div
                      key={tech.name}
                      className="tech-card group relative p-4 rounded-xl bg-[#1a0505]/60 border border-[#ff3232]/20 hover:border-[#ff3232]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,50,50,0.2)]"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Terminal Header */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-50">
                        <div className="w-2 h-2 rounded-full bg-[#ff3232]/50" />
                        <div className="w-2 h-2 rounded-full bg-[#ff3232]/30" />
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded bg-[#ff3232]/10 group-hover:bg-[#ff3232]/20 transition-colors">
                          <Icon className="w-5 h-5 text-[#ff3232]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-mono text-sm">{`> ${tech.name}`}</span>
                            <span className="text-[#ff3232] font-mono text-xs">
                              [{tech.level}%]
                            </span>
                          </div>
                          {/* Terminal Progress */}
                          <div className="font-mono text-xs text-[#ff3232]/60 flex items-center gap-1">
                            <span>[</span>
                            <span className="flex-1 flex">
                              {Array.from({ length: 20 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={
                                    i < tech.level / 5
                                      ? 'text-[#ff3232]'
                                      : 'text-[#ff3232]/20'
                                  }
                                >
                                  =
                                </span>
                              ))}
                            </span>
                            <span>]</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0096ff]/30 to-[#ff3232]/30 to-transparent" />
    </section>
  );
}
