import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from './sections/HeroSection';
import TechStackSection from './sections/TechStackSection';
import PortalsSection from './sections/PortalsSection';
import OracleSection from './sections/OracleSection';
import LoadingScreen from './sections/LoadingScreen';
import Navigation from './components/Navigation';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading time for assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && mainRef.current) {
      // Initialize scroll animations after loading
      const ctx = gsap.context(() => {
        // Refresh ScrollTrigger after content loads
        ScrollTrigger.refresh();
      }, mainRef);

      return () => ctx.revert();
    }
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative min-h-screen bg-gateway-bg overflow-x-hidden">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main ref={mainRef} className="relative">
        {/* Hero Section */}
        <section id="hero" className="relative z-10">
          <HeroSection />
        </section>
        
        {/* Tech Stack Section */}
        <section id="tech-stack" className="relative z-20">
          <TechStackSection />
        </section>
        
        {/* Portals Section */}
        <section id="portals" className="relative z-30">
          <PortalsSection />
        </section>
        
        {/* Oracle Section */}
        <section id="oracle" className="relative z-40">
          <OracleSection />
        </section>
        
        {/* Footer */}
        <footer className="relative z-40 py-12 bg-[#050a1f] border-t border-[#0096ff]/10">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-gray-400 text-sm">
              <span className="text-[#0096ff]">&lt;/&gt;</span> with 
              <span className="text-[#ff3232]"> &lt;3</span> by Shayan Ali
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Dual-Core Engineer • 2024
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
