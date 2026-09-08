'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';

const WORDS = ['RAG', 'AGENT', 'LLM', 'PIPELINE', 'GUARDRAIL', 'EMBEDDING', 'VECTOR', 'DOTNET', 'PYTHON', 'N8N', 'LANGCHAIN', 'AZURE'];
const RADIUS = 150;

type CharData = {
  char: string;
  isAccent: boolean;
  x: number;
  y: number;
  z: number;
  rotY: number;
  rotX: number;
};

export default function OrbitalSphere() {
  const sphereRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const [mounted, setMounted] = useState(false);

  // Build sphere data: place whole words on latitudes, characters follow longitude
  const charData = useMemo<CharData[]>(() => {
    const result: CharData[] = [];
    
    // Distribute words across latitudes (rows)
    const totalWords = WORDS.length;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    
    for (let w = 0; w < totalWords; w++) {
      const word = WORDS[w];
      const y = 1 - (w / (totalWords - 1)) * 2; // -1 to 1
      const latitudeRadius = Math.sqrt(1 - y * y);
      const latitudeAngle = Math.asin(y);
      
      // Start longitude for this word
      const startTheta = w * goldenAngle * 3;
      
      for (let c = 0; c < word.length; c++) {
        const theta = startTheta + (c * 0.15); // Spread chars along longitude
        const x = Math.cos(theta) * latitudeRadius;
        const z = Math.sin(theta) * latitudeRadius;
        
        // Face outward
        const rotY = -theta * (180 / Math.PI);
        const rotX = -latitudeAngle * (180 / Math.PI);
        
        result.push({
          char: word[c],
          isAccent: false,
          x: x * RADIUS,
          y: y * RADIUS,
          z: z * RADIUS,
          rotY,
          rotX,
        });
      }
      
      // Add separator dot after word
      const sepTheta = startTheta + (word.length * 0.15);
      const sepX = Math.cos(sepTheta) * latitudeRadius;
      const sepZ = Math.sin(sepTheta) * latitudeRadius;
      
      result.push({
        char: '·',
        isAccent: true,
        x: sepX * RADIUS,
        y: y * RADIUS,
        z: sepZ * RADIUS,
        rotY: -sepTheta * (180 / Math.PI),
        rotX: -latitudeAngle * (180 / Math.PI),
      });
    }
    
    return result;
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const animate = () => {
      rotationRef.current.y += 0.25;
      rotationRef.current.x = Math.sin(rotationRef.current.y * 0.003) * 10;
      
      if (sphereRef.current) {
        sphereRef.current.style.transform = `rotateX(${rotationRef.current.x}deg) rotateY(${rotationRef.current.y}deg)`;
      }
      
      rafRef.current = requestAnimationFrame(animate);
    };
    
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mounted]);

  // Smooth depth-based opacity: z goes from -RADIUS (back) to +RADIUS (front)
  const getOpacity = (z: number, isAccent: boolean) => {
    // Normalize z from [-1, 1] to [0, 1] where 1 = front, 0 = back
    const depth = (z + RADIUS) / (RADIUS * 2);
    // Smoothstep for natural falloff
    const smooth = depth * depth * (3 - 2 * depth);
    
    if (isAccent) {
      // Lime dots: visible even on back, glow on front
      return 0.2 + (smooth * 0.8);
    }
    // Regular chars: fade to near-invisible on back
    return 0.05 + (smooth * 0.45);
  };

  if (!mounted) {
    return (
      <div className="hidden lg:flex items-center justify-center w-[420px] h-[420px] relative select-none">
        <div className="absolute w-2 h-2 rounded-full bg-[#C6F24E]/30" />
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center justify-center w-[420px] h-[420px] relative select-none">
      {/* 3D scene */}
      <div
        className="absolute"
        style={{
          width: '320px',
          height: '320px',
          perspective: '700px',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          ref={sphereRef}
          className="absolute inset-0"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(0deg) rotateY(0deg)',
          }}
        >
          {charData.map((data, i) => {
            const opacity = getOpacity(data.z, data.isAccent);
            const glow = data.isAccent && data.z > 0 ? '0 0 8px rgba(198, 242, 78, 0.5)' : 'none';
            
            return (
              <span
                key={i}
                className="absolute font-mono text-[11px]"
                style={{
                  left: '50%',
                  top: '50%',
                  color: data.isAccent ? '#C6F24E' : '#E9EDE6',
                  opacity,
                  transform: `
                    translate(-50%, -50%)
                    translate3d(${data.x}px, ${-data.y}px, ${data.z}px)
                    rotateY(${data.rotY}deg)
                    rotateX(${data.rotX}deg)
                  `,
                  textShadow: glow,
                  backfaceVisibility: 'hidden',
                  willChange: 'transform',
                }}
              >
                {data.char}
              </span>
            );
          })}
        </div>
      </div>
      
      {/* Center core */}
      <div 
        className="absolute w-3 h-3 rounded-full"
        style={{ 
          background: 'rgba(198, 242, 78, 0.8)',
          boxShadow: '0 0 25px rgba(198, 242, 78, 0.35), 0 0 50px rgba(198, 242, 78, 0.1)',
        }} 
      />
    </div>
  );
}