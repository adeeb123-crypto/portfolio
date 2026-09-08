"use client";

import React, { useEffect, useRef, useState } from "react";
import OrbitalRing from './components/OrbitalRing';
import SystemMonitor from './components/SystemMonitor';
import ImageWipe from './components/ImageWipe';
import TextReveal from './components/TextReveal';
import ContactForm from './components/ContactForm';

export default function Portfolio() {
  const [scrambledName, setScrambledName] = useState("");
  const [time, setTime] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const workRef = useRef<HTMLElement>(null);

  const name = "ADEEB WAIZ";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

  const projects = [
    {
      num: "01",
      title: "NL2SQL Engine",
      year: "2024",
      stack: ".NET · Azure OpenAI · Angular",
      desc: "Natural language to SQL with schema-validation guardrails. Reduced ad-hoc data tickets by 60%.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    },
    {
      num: "02",
      title: "RAG Document Agent",
      year: "2024",
      stack: "Python · LangChain · pgvector",
      desc: "On-premise document search with local LLMs. Zero external data leakage across 500+ documents.",
      image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&q=80",
    },
    {
      num: "03",
      title: "Auto Data Agent",
      year: "2023",
      stack: "Python · Playwright · n8n",
      desc: "Automated collection and normalization pipeline. 10,000+ records weekly, zero manual scraping.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    },
  ];

  const experience = [
    { role: "Full Stack Developer", company: "Market-i Research", period: "2025 — Present" },
    { role: "Full Stack Developer", company: "INTELPEEK", period: "2023 — 2025" },
    { role: "Web Developer Intern", company: "VAI Marketing", period: "2022 — 2023" },
  ];

  useEffect(() => {
    let frame = 0;
    const totalFrames = 40;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const revealed = Math.floor(progress * name.length);
      let result = "";
      for (let i = 0; i < name.length; i++) {
        if (name[i] === " ") {
          result += " ";
        } else if (i < revealed) {
          result += name[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setScrambledName(result);
      if (frame >= totalFrames) {
        setScrambledName(name);
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "Asia/Dubai",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handle = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0C0A] text-[#E9EDE6] selection:bg-[#C6F24E] selection:text-[#0B0C0A] overflow-x-hidden font-sans relative">
      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Vertical grid lines */}
      <div className="fixed inset-0 pointer-events-none z-40 flex justify-between px-[5vw] opacity-[0.04]">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-px h-full bg-[#E9EDE6]" />
        ))}
      </div>

      {/* Custom cursor glow */}
      <div
        className="fixed pointer-events-none z-30 w-64 h-64 rounded-full hidden md:block"
        style={{
          background: "radial-gradient(circle, rgba(198,242,78,0.04) 0%, transparent 70%)",
          transform: `translate(${mousePos.x - 128}px, ${mousePos.y - 128}px)`,
          transition: "transform 0.15s ease-out",
        }}
      />

      {/* Status bar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#E9EDE6]/10 bg-[#0B0C0A]/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-3 text-xs font-mono tracking-wider uppercase">
          <div className="flex items-center gap-6">
            <span className="font-semibold">Adeeb Waiz</span>
            <span className="text-[#E9EDE6]/40">·</span>
            <span className="text-[#E9EDE6]/60">Dubai</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6F24E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C6F24E]"></span>
            </span>
            <span className="text-[#C6F24E]">Open to work</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      {/* Hero */}
      {/* Hero */}
            <section ref={heroRef} className="min-h-screen flex flex-col lg:flex-row justify-center items-center px-6 md:px-[7vw] pt-20 gap-8 lg:gap-10">
        <div className="flex-1 text-center lg:text-left max-w-2xl lg:max-w-none">
          <h1 className="text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[8vw] font-bold leading-[0.9] tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {scrambledName || name}
          </h1>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-[#E9EDE6]/60 max-w-xl mx-auto lg:mx-0">
            AI Engineer shipping end-to-end systems — RAG pipelines, agentic workflows, and LLM guardrails on cloud-native foundations.
          </p>
          <div className="mt-6 flex items-center justify-center lg:justify-start gap-4">
            <a
              href="/cv.pdf"
              download
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#E9EDE6]/20 text-sm font-mono text-[#E9EDE6]/60 hover:text-[#C6F24E] hover:border-[#C6F24E]/40 transition-colors duration-300"
            >
              Download CV ↗
            </a>
          </div>
          <div className="mt-8 font-mono text-sm text-[#E9EDE6]/40 flex items-center justify-center lg:justify-start gap-2">
            <span className="text-[#C6F24E]">~</span>
            <span>$</span>
            <span className="animate-pulse">_</span>
          </div>
        </div>
        
        {/* System monitor - right side on desktop, below on mobile */}
        <div className="w-full max-w-sm mx-auto lg:max-w-none lg:w-auto lg:block lg:flex-shrink-0 mt-0 lg:mt-0">
          <SystemMonitor />
        </div>
      </section>

      {/* Marquee */}
      <div className="border-y border-[#E9EDE6]/10 py-4 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-sm font-mono text-[#E9EDE6]/30 mx-4 flex items-center gap-4">
              <span>LangChain</span><span className="text-[#C6F24E]/40">✦</span>
              <span>Azure OpenAI</span><span className="text-[#C6F24E]/40">✦</span>
              <span>Python</span><span className="text-[#C6F24E]/40">✦</span>
              <span>.NET</span><span className="text-[#C6F24E]/40">✦</span>
              <span>TypeScript</span><span className="text-[#C6F24E]/40">✦</span>
              <span>PostgreSQL</span><span className="text-[#C6F24E]/40">✦</span>
              <span>Docker</span><span className="text-[#C6F24E]/40">✦</span>
              <span>Terraform</span><span className="text-[#C6F24E]/40">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Selected Work */}
      <section ref={workRef} className="py-32 px-6 md:px-[5vw]">
        <TextReveal className="flex items-baseline gap-4 mb-20 reveal">
          <span className="font-mono text-xs text-[#C6F24E] tracking-wider">SELECTED WORK</span>
          <div className="flex-1 h-px bg-[#E9EDE6]/10" />
        </TextReveal>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Sticky index */}
          <div className="lg:w-48 lg:sticky lg:top-32 lg:self-start">
            <div className="flex lg:flex-col gap-4 font-mono text-sm">
              {projects.map((p) => (
                <button
                  key={p.num}
                  onClick={() => {
                    const el = document.getElementById(`project-${p.num}`);
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`text-left transition-colors duration-300 ${hoveredProject === p.num ? "text-[#C6F24E]" : "text-[#E9EDE6]/30 hover:text-[#E9EDE6]/60"}`}
                >
                  {p.num}
                </button>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="flex-1 space-y-32">
            {projects.map((project) => (
              <div
                key={project.num}
                id={`project-${project.num}`}
                className="group reveal"
                onMouseEnter={() => setHoveredProject(project.num)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <ImageWipe
                  src={project.image}
                  alt={project.title}
                  className="mb-6 h-[50vh]"
                />
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="text-4xl md:text-5xl font-bold font-space group-hover:text-[#C6F24E] transition-colors duration-300">
                    {project.title}
                  </h3>
                  <span className="font-mono text-xs text-[#E9EDE6]/40">{project.year}</span>
                </div>
                <div className="font-mono text-xs text-[#C6F24E] mb-4 tracking-wider">{project.stack}</div>
                <p className="text-[#E9EDE6]/60 max-w-2xl text-base leading-relaxed">{project.desc}</p>
                <div className="mt-6 h-px bg-[#E9EDE6]/10 relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-[#C6F24E] w-0 group-hover:w-full transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-32 px-6 md:px-[5vw] border-t border-[#E9EDE6]/10">
        <div className="flex items-baseline gap-4 mb-20 reveal">
          <span className="font-mono text-xs text-[#C6F24E] tracking-wider">ABOUT</span>
          <div className="flex-1 h-px bg-[#E9EDE6]/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="space-y-6 text-[#E9EDE6]/70 leading-relaxed reveal">
            <p>
              Full-stack engineer turned AI systems builder. Three years shipping .NET and MERN applications, now focused on production-grade AI — RAG pipelines, agent orchestration, and LLM guardrails that actually hold up under enterprise scrutiny.
            </p>
            <p>
              Recently eliminated 20+ hours of manual reporting per cycle with an event-driven document pipeline, cut Azure OpenAI costs by 30%, and enforced strict data governance upstream. The goal is always the same: make the complex disappear.
            </p>
          </div>

          <div className="relative reveal">
            <blockquote className="text-3xl md:text-4xl lg:text-5xl font-bold font-space leading-tight text-[#E9EDE6]/90">
              &ldquo;The best code is the code you don&apos;t write.&rdquo;
            </blockquote>
            <cite className="block mt-6 font-mono text-xs text-[#E9EDE6]/40 not-italic">— Adeeb Waiz</cite>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-32 px-6 md:px-[5vw] border-t border-[#E9EDE6]/10">
        <div className="flex items-baseline gap-4 mb-20 reveal">
          <span className="font-mono text-xs text-[#C6F24E] tracking-wider">EXPERIENCE</span>
          <div className="flex-1 h-px bg-[#E9EDE6]/10" />
        </div>

        <div className="max-w-4xl reveal">
          {experience.map((exp, i) => (
            <div
              key={i}
              className="group flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-[#E9EDE6]/10 cursor-default transition-colors duration-300 hover:bg-[#E9EDE6]/[0.02] px-2 -mx-2"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                <span className="font-mono text-xs text-[#C6F24E] w-32">{exp.period}</span>
                <span className="text-lg font-medium group-hover:text-[#C6F24E] transition-colors duration-300">
                  {exp.role}
                </span>
              </div>
              <span className="text-[#E9EDE6]/40 mt-2 md:mt-0">{exp.company}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="min-h-screen flex flex-col justify-between px-6 md:px-[5vw] py-20 border-t border-[#E9EDE6]/10">
        {/* <div className="flex-1 flex items-center reveal">
          <a href="mailto:waizadeeb@gmail.com" className="group relative inline-block">
            <span className="text-[15vw] md:text-[12vw] font-bold font-space leading-none transition-colors duration-500 group-hover:text-[#0B0C0A] relative z-10">
              let&apos;s talk →
            </span>
            <div className="absolute inset-0 bg-[#C6F24E] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left -mx-4 px-4" />
          </a>
        </div> */}
        <ContactForm />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pt-20">
          <div className="space-y-2 font-mono text-xs text-[#E9EDE6]/40">
            <a href="mailto:waizadeeb@gmail.com" className="block hover:text-[#C6F24E] transition-colors">waizadeeb@gmail.com</a>
            <a href="https://linkedin.com/in/adeeb-waiz" className="block hover:text-[#C6F24E] transition-colors">linkedin.com/in/adeeb-waiz</a>
            <a href="https://github.com/adeeb-waiz" className="block hover:text-[#C6F24E] transition-colors">github.com/adeeb-waiz</a>
          </div>
          <div className="font-mono text-xs text-[#E9EDE6]/40">
            <span className="text-[#C6F24E]">DXB</span> {time} GST
          </div>
        </div>
      </footer>
    </div>
  );
}