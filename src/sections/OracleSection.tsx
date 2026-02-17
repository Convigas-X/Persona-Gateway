import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Send, Loader2, Code2, Terminal, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

gsap.registerPlugin(ScrollTrigger);

interface Recommendation {
  type: 'architect' | 'operator' | 'both';
  reason: string;
  confidence: number;
}

export default function OracleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [userInput, setUserInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        '.oracle-title',
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

      // Terminal animation - plays once and stays visible
      gsap.fromTo(
        terminalRef.current,
        { y: 80, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
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

  const analyzeWithGroq = async () => {
    if (!userInput.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    setRecommendation(null);

    try {
      // Get API key from environment or prompt user
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      
      if (!apiKey) {
        // Fallback to local analysis if no API key
        await simulateLocalAnalysis();
        return;
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant helping users choose between two portfolio paths:

1. THE ARCHITECT (Full Stack Development & UI/UX):
   - React.js, Next.js, Node.js, TypeScript, Tailwind CSS
   - Web applications, dashboards, e-commerce, SaaS platforms
   - UI/UX design, responsive design, performance optimization

2. THE OPERATOR (Offensive Security & Low-Level Engineering):
   - Offensive security, penetration testing, vulnerability assessment
   - Arch Linux, kernel optimization, bash scripting
   - Blockchain, smart contracts, decentralized systems

Analyze the user's request and respond with a JSON object containing:
- type: "architect" | "operator" | "both"
- reason: A brief explanation (2-3 sentences) of why this path is recommended. DO NOT include any URLs in the reason.
- confidence: A number between 0-100 indicating confidence level

Respond ONLY with the JSON object, no other text.`,
            },
            {
              role: 'user',
              content: userInput,
            },
          ],
          temperature: 0.3,
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (content) {
        try {
          const parsed = JSON.parse(content);
          setRecommendation(parsed);
        } catch {
          // If parsing fails, use the content as reason
          setRecommendation({
            type: 'both',
            reason: content,
            confidence: 70,
          });
        }
      }
    } catch (err) {
      console.error('Groq API error:', err);
      // Fallback to local analysis
      await simulateLocalAnalysis();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const simulateLocalAnalysis = async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const input = userInput.toLowerCase();
    
    // Keywords for each path
    const architectKeywords = [
      'website', 'web', 'frontend', 'ui', 'ux', 'design', 'react', 'nextjs', 
      'app', 'application', 'dashboard', 'interface', 'responsive', 'ecommerce',
      'saas', 'landing page', 'portfolio', 'cms', 'blog', 'shop'
    ];
    
    const operatorKeywords = [
      'security', 'hack', 'penetration', 'vulnerability', 'audit', 'linux',
      'kernel', 'system', 'server', 'blockchain', 'smart contract', 'crypto',
      'defi', 'nft', 'ethereum', 'solidity', 'bash', 'script', 'automation',
      'hardening', 'forensics', 'malware'
    ];

    let architectScore = 0;
    let operatorScore = 0;

    architectKeywords.forEach((keyword) => {
      if (input.includes(keyword)) architectScore++;
    });

    operatorKeywords.forEach((keyword) => {
      if (input.includes(keyword)) operatorScore++;
    });

    let result: Recommendation;

    if (architectScore > operatorScore && architectScore > 0) {
      result = {
        type: 'architect',
        reason: 'Your project requirements strongly indicate a need for modern web development expertise. The Architect path specializes in building high-performance, pixel-perfect web applications with React, Next.js, and Node.js.',
        confidence: Math.min(70 + architectScore * 10, 95),
      };
    } else if (operatorScore > architectScore && operatorScore > 0) {
      result = {
        type: 'operator',
        reason: 'Your needs align with deep systems engineering and security expertise. The Operator path specializes in offensive security, low-level Linux engineering, and blockchain development.',
        confidence: Math.min(70 + operatorScore * 10, 95),
      };
    } else {
      result = {
        type: 'both',
        reason: 'Your project appears to have diverse requirements spanning both web development and systems engineering. Both skill sets may be valuable for your needs.',
        confidence: 60,
      };
    }

    setRecommendation(result);
  };

  const getRecommendationDisplay = () => {
    if (!recommendation) return null;

    const configs = {
      architect: {
        icon: Code2,
        title: 'ARCHITECT PATH RECOMMENDED',
        color: 'text-[#0096ff]',
        bgColor: 'bg-[#0096ff]/10',
        borderColor: 'border-[#0096ff]/30',
        link: 'https://react-portfolio-sage.vercel.app/',
        linkText: 'Enter the Studio',
      },
      operator: {
        icon: Terminal,
        title: 'OPERATOR PATH RECOMMENDED',
        color: 'text-[#ff3232]',
        bgColor: 'bg-[#ff3232]/10',
        borderColor: 'border-[#ff3232]/30',
        link: 'https://shayan-eight.vercel.app/',
        linkText: 'Enter the Matrix',
      },
      both: {
        icon: Sparkles,
        title: 'DUAL EXPERTISE RECOMMENDED',
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
        link: null,
        linkText: null,
      },
    };

    const config = configs[recommendation.type];
    const Icon = config.icon;

    return (
      <div className={`mt-6 p-6 rounded-xl ${config.bgColor} border ${config.borderColor}`}>
        <div className="flex items-center gap-3 mb-4">
          <Icon className={`w-6 h-6 ${config.color}`} />
          <h4 className={`font-mono font-bold ${config.color}`}>
            {config.title}
          </h4>
          <span className="ml-auto text-xs font-mono text-gray-400">
            Confidence: {recommendation.confidence}%
          </span>
        </div>
        <p className="text-white/80 mb-4 leading-relaxed">
          {recommendation.reason}
        </p>
        {config.link && (
          <a
            href={config.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 ${config.color} font-mono text-sm hover:underline`}
          >
            <span>{config.linkText}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        )}
        {recommendation.type === 'both' && (
          <div className="flex gap-4 mt-4">
            <a
              href="https://react-portfolio-sage.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#0096ff] font-mono text-sm hover:underline"
            >
              <span>Enter the Studio</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://shayan-eight.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#ff3232] font-mono text-sm hover:underline"
            >
              <span>Enter the Matrix</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-20 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050a1f] via-[#0a0f2e] to-[#050a1f]" />

      {/* Section Title */}
      <div className="oracle-title text-center mb-16 px-6 relative z-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#0096ff]/20 to-[#ff3232]/20 border border-white/10">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-gray-300 font-mono text-sm tracking-wider">
            AI-POWERED GUIDANCE
          </span>
        </div>
        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
          <span className="text-white">THE </span>
          <span className="bg-gradient-to-r from-[#0096ff] to-[#ff3232] bg-clip-text text-transparent">ORACLE</span>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Not sure which path to take? Describe your project and let the AI guide you
        </p>
      </div>

      {/* Terminal Interface */}
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div
          ref={terminalRef}
          className="relative rounded-2xl overflow-hidden border border-[#0096ff]/20 hover:border-[#0096ff]/40 transition-all duration-500 shadow-[0_0_30px_rgba(0,150,255,0.1)]"
        >
          {/* Terminal Header */}
          <div className="bg-[#0a1535]/80 backdrop-blur px-4 py-3 flex items-center gap-2 border-b border-[#0096ff]/20">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff3232]/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-[#0096ff]/80" />
            </div>
            <div className="flex-1 text-center">
              <span className="font-mono text-xs text-gray-400">
                oracle.exe — AI Recommendation Engine
              </span>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="bg-[#050a1f]/90 backdrop-blur p-6">
            {/* Prompt */}
            <div className="mb-4">
              <p className="font-mono text-sm text-gray-400">
                <span className="text-[#0096ff]">root@gateway</span>
                <span className="text-white">:</span>
                <span className="text-[#ff3232]">~</span>
                <span className="text-white">$</span>
                <span className="ml-2">describe your project needs below</span>
              </p>
            </div>

            {/* Input Area */}
            <div className="relative">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Example: I need a secure e-commerce platform with a modern UI and payment integration..."
                className="min-h-[120px] bg-[#0a1535]/50 border-[#0096ff]/20 text-white placeholder:text-gray-500 font-mono text-sm resize-none focus:border-[#0096ff]/50 focus:ring-[#0096ff]/20"
                disabled={isAnalyzing}
              />
              
              {/* Character Count */}
              <div className="absolute bottom-2 right-2 text-xs font-mono text-gray-500">
                {userInput.length}/500
              </div>
            </div>

            {/* Analyze Button */}
            <div className="mt-4 flex justify-end">
              <Button
                onClick={analyzeWithGroq}
                disabled={!userInput.trim() || isAnalyzing}
                className="bg-gradient-to-r from-[#0096ff] to-[#ff3232] text-white font-mono font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed border-0"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ANALYZING...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    ANALYZE REQUIREMENTS
                  </>
                )}
              </Button>
            </div>

            {/* Analysis Output */}
            {isAnalyzing && (
              <div className="mt-6 p-4 rounded-lg bg-[#0a1535]/50 border border-[#0096ff]/20">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-[#0096ff] animate-spin" />
                  <span className="font-mono text-sm text-[#0096ff]">
                    Processing input...
                  </span>
                </div>
                <div className="mt-2 font-mono text-xs text-gray-400">
                  {`> Parsing requirements`}<br />
                  {`> Matching against skill matrix`}<br />
                  {`> Calculating optimal path...`}
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 rounded-lg bg-[#ff3232]/10 border border-[#ff3232]/30">
                <p className="font-mono text-sm text-[#ff3232]">
                  Error: {error}
                </p>
              </div>
            )}

            {recommendation && getRecommendationDisplay()}
          </div>

          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-[#0096ff]/50" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-[#ff3232]/50" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-[#0096ff]/50" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[#ff3232]/50" />
        </div>

        {/* Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#0a1535]/50 border border-[#0096ff]/20 hover:border-[#0096ff]/40 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Code2 className="w-4 h-4 text-[#0096ff]" />
              <span className="font-mono text-sm text-[#0096ff]">
                Architect Keywords
              </span>
            </div>
            <p className="text-xs text-gray-400">
              website, web app, UI/UX, React, Next.js, dashboard, e-commerce, frontend, design
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#1a0505]/50 border border-[#ff3232]/20 hover:border-[#ff3232]/40 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-[#ff3232]" />
              <span className="font-mono text-sm text-[#ff3232]">
                Operator Keywords
              </span>
            </div>
            <p className="text-xs text-gray-400">
              security, audit, Linux, kernel, blockchain, smart contract, penetration testing
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
