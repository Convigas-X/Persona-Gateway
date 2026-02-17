import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const handleScroll = () => {
      // Show nav after scrolling past hero
      setIsVisible(window.scrollY > window.innerHeight * 0.5);

      // Determine active section
      const sections = navItems.map((item) => ({
        id: item.id,
        element: document.getElementById(item.id),
      }));

      const scrollPosition = window.scrollY + window.innerHeight / 3;

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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100]">
      <div className="bg-[#0a1535]/60 backdrop-blur-xl rounded-full px-2 py-2 flex items-center gap-1 border border-[#0096ff]/20 shadow-[0_0_30px_rgba(0,150,255,0.15)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`
                relative px-4 py-2 rounded-full flex items-center gap-2
                transition-all duration-300 text-sm font-medium
                ${isActive 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white'
                }
              `}
            >
              {/* Active Background */}
              {isActive && (
                <span 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 150, 255, 0.3) 0%, rgba(255, 50, 50, 0.3) 100%)',
                  }}
                />
              )}
              
              {/* Content */}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0096ff]' : ''}`} />
                <span className="hidden md:inline">{item.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
