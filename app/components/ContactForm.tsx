'use client';

import React, { useState, useRef, useEffect } from 'react';

type FormState = 'idle' | 'typing' | 'submitting' | 'success';

export default function ContactForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>('idle');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const formRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Email is required');
      return;
    }

    setFormState('submitting');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setFormState('success');

    // Reset after animation
    setTimeout(() => {
      setFormState('idle');
      setEmail('');
      setPhone('');
      setMessage('');
      setIsOpen(false);
    }, 2500);
  };

  const handleClose = () => {
    if (formState === 'submitting') return;
    setIsOpen(false);
    setFormState('idle');
    setError('');
  };

  // Success animation particles
  const SuccessAnimation = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-[#C6F24E] flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-[#C6F24E]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            style={{
              strokeDasharray: 20,
              strokeDashoffset: 0,
              animation: 'checkDraw 0.6s ease-out forwards',
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div 
          className="absolute inset-0 rounded-full bg-[#C6F24E]/20"
          style={{ animation: 'successPulse 1s ease-out forwards' }}
        />
      </div>
      <p className="mt-6 font-mono text-sm text-[#C6F24E]">Message sent</p>
      <p className="mt-2 font-mono text-xs text-[#E9EDE6]/40">I'll get back to you soon</p>
    </div>
  );

  if (!isOpen) {
    return (
      <div className="flex-1 flex items-center reveal">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative inline-block text-left"
        >
          <span 
            className="text-[15vw] md:text-[12vw] font-bold leading-none transition-colors duration-500 group-hover:text-[#0B0C0A] relative z-10" 
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            let&apos;s talk →
          </span>
          <div className="absolute inset-0 bg-[#C6F24E] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left -mx-4 px-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center reveal">
      <div 
        ref={formRef}
        className="w-full max-w-xl relative"
        style={{
          animation: 'formSlideIn 0.4s ease-out forwards',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 font-mono text-xs text-[#E9EDE6]/40 hover:text-[#C6F24E] transition-colors"
        >
          [ close ]
        </button>

        {formState === 'success' ? (
          <SuccessAnimation />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email - required */}
            <div className="space-y-2">
              <label className="font-mono text-xs text-[#E9EDE6]/40 uppercase tracking-wider">
                Email <span className="text-[#C6F24E]">*</span>
              </label>
              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-transparent border-b border-[#E9EDE6]/20 focus:border-[#C6F24E] text-[#E9EDE6] font-mono text-sm py-2 outline-none transition-colors placeholder:text-[#E9EDE6]/15"
              />
            </div>

            {/* Phone - optional */}
            <div className="space-y-2">
              <label className="font-mono text-xs text-[#E9EDE6]/40 uppercase tracking-wider">
                Phone <span className="text-[#E9EDE6]/20">(optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+971 50 000 0000"
                className="w-full bg-transparent border-b border-[#E9EDE6]/20 focus:border-[#C6F24E] text-[#E9EDE6] font-mono text-sm py-2 outline-none transition-colors placeholder:text-[#E9EDE6]/15"
              />
            </div>

            {/* Message - optional */}
            <div className="space-y-2">
              <label className="font-mono text-xs text-[#E9EDE6]/40 uppercase tracking-wider">
                Message <span className="text-[#E9EDE6]/20">(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's on your mind?"
                rows={3}
                className="w-full bg-transparent border-b border-[#E9EDE6]/20 focus:border-[#C6F24E] text-[#E9EDE6] font-mono text-sm py-2 outline-none transition-colors resize-none placeholder:text-[#E9EDE6]/15"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="font-mono text-xs text-red-400 animate-fade-in">{error}</p>
            )}

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={formState === 'submitting'}
                className="group relative inline-flex items-center gap-3 font-mono text-sm text-[#E9EDE6] hover:text-[#C6F24E] transition-colors disabled:opacity-50"
              >
                <span className={formState === 'submitting' ? 'animate-pulse' : ''}>
                  {formState === 'submitting' ? 'Sending...' : 'Send message →'}
                </span>
                {formState === 'submitting' && (
                  <span className="w-4 h-4 border-2 border-[#C6F24E]/30 border-t-[#C6F24E] rounded-full animate-spin" />
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}