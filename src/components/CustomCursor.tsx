import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [cursorType, setCursorType] = useState<'default' | 'architect' | 'operator'>('default');
  const [isTouchDevice] = useState(() => 
    typeof window !== 'undefined' ? window.matchMedia('(pointer: coarse)').matches : false
  );

  useEffect(() => {
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    // Initial position off-screen
    gsap.set([cursor, cursorDot], { xPercent: -50, yPercent: -50 });

    const onMouseMove = (e: MouseEvent) => {
      // Fast, responsive cursor following
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: 'power2.out',
      });

      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.02,
        ease: 'none',
      });
    };

    // Detect hover on architect/operator elements
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-cursor="architect"]')) {
        setCursorType('architect');
      } else if (target.closest('[data-cursor="operator"]')) {
        setCursorType('operator');
      } else {
        setCursorType('default');
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
    };
  }, [isTouchDevice]);

  // Don't render on touch devices
  if (isTouchDevice) return null;

  const getCursorColor = () => {
    switch (cursorType) {
      case 'architect':
        return 'border-architect-accent';
      case 'operator':
        return 'border-operator-accent';
      default:
        return 'border-white/50';
    }
  };

  const getDotColor = () => {
    switch (cursorType) {
      case 'architect':
        return 'bg-architect-accent';
      case 'operator':
        return 'bg-operator-accent';
      default:
        return 'bg-white';
    }
  };

  return (
    <>
      {/* Outer Ring */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-10 h-10 rounded-full border-2 pointer-events-none z-[9999] mix-blend-difference transition-colors duration-200 ${getCursorColor()}`}
        style={{ willChange: 'transform' }}
      />
      
      {/* Inner Dot */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999] transition-colors duration-200 ${getDotColor()}`}
        style={{ willChange: 'transform' }}
      />

      {/* Hide default cursor */}
      <style>{`
        * {
          cursor: none !important;
        }
        @media (pointer: coarse) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
}
