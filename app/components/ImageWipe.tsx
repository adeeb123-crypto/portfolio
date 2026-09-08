'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ImageWipeProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageWipe({ src, alt, className = '' }: ImageWipeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current || !overlayRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      tl.fromTo(
        overlayRef.current,
        { scaleX: 1 },
        { scaleX: 0, duration: 1, ease: 'power3.inOut' }
      )
      .fromTo(
        imageRef.current,
        { scale: 1.3, filter: 'blur(10px)' },
        { scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out' },
        '-=0.6'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div 
        ref={overlayRef} 
        className="absolute inset-0 bg-[#0B0C0A] z-10 origin-right"
      />
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}