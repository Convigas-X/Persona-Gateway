import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Code2, Terminal, Cpu, Sparkles } from 'lucide-react';

const navItems = [
  { id: 'hero', label: 'Home', icon: Code2 },
  { id: 'tech-stack', label: 'Tech Stack', icon: Cpu },
  { id: 'portals', label: 'Portfolios', icon: Terminal },
  { id: 'oracle', label: 'AI Guide', icon: Sparkles },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const activeIndicatorRef = useRef<HTMLSpanElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrollY = window.scrollY;
      
      // Show/Hide with threshold
      const shouldBeVisible = scrollY > heroHeight * 0.4;
      if (shouldBeVisible !== isVisible) {
        setIsVisible(shouldBeVisible);
      }

      // Determine active section
      const sections = navItems.map((item) => ({
        id: item.id,
        element: document.getElementById(item.id),
      }));

      const scrollPosition = scrollY + window.innerHeight / 2;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const offsetTop = section.element.offsetTop;
          if (scrollPosition >= offsetTop) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  // Handle nav entrance/exit animation
  useEffect(() => {
    if (navRef.current) {
      if (isVisible) {
        gsap.to(navRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          display: 'block',
        });
      } else {
        gsap.to(navRef.current, {
          y: -20,
          opacity: 0,
          duration: 0.4,
          ease: 'power3.in',
          onComplete: () => {
            if (navRef.current) navRef.current.style.display = 'none';
          }
        });
      }
    }
  }, [isVisible]);

  // Handle sliding active indicator
  useEffect(() => {
    const activeIndex = navItems.findIndex(item => item.id === activeSection);
    const activeButton = buttonsRef.current[activeIndex];
    const indicator = activeIndicatorRef.current;

    if (activeButton && indicator) {
      const { offsetLeft, offsetWidth } = activeButton;
      gsap.to(indicator, {
        x: offsetLeft,
        width: offsetWidth,
        duration: 0.5,
        ease: 'elastic.out(1, 0.8)',
      });
    }
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 0;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav 
      ref={navRef}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] hidden opacity-0"
    >
      <div className="relative bg-[#0a1535]/80 backdrop-blur-xl rounded-full p-1.5 flex items-center border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5),0_0_20px_rgba(0,150,255,0.1)]">
        {/* Sliding Active Indicator */}
        <span 
          ref={activeIndicatorRef}
          className="absolute h-[calc(100%-12px)] top-[6px] rounded-full bg-gradient-to-r from-[#0096ff]/20 to-[#ff3232]/20 border border-white/10"
          style={{ width: 0 }}
        />

        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              ref={el => buttonsRef.current[index] = el}
              onClick={() => scrollToSection(item.id)}
              className={`
                relative px-5 py-2.5 rounded-full flex items-center gap-2.5
                transition-colors duration-300 text-sm font-medium
                ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}
              `}
            >
              <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'text-[#0096ff] scale-110' : 'group-hover:scale-110'}`} />
              <span className="hidden md:inline relative z-10">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
