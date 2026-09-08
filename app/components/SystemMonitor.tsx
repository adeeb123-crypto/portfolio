'use client';

import React, { useEffect, useRef, useState } from 'react';

type LogType = 'info' | 'success' | 'warn' | 'accent';

type LogEntry = {
  timestamp: string;
  system: string;
  message: string;
  type: LogType;
};

const LOG_LINES: Omit<LogEntry, 'timestamp'>[] = [
  { system: 'NL2SQL', message: 'Query compiled: SELECT * FROM quarterly_revenue', type: 'info' },
  { system: 'NL2SQL', message: 'Schema validation passed (12ms)', type: 'success' },
  { system: 'RAG-AGENT', message: 'Embedding model loaded: all-MiniLM-L6-v2', type: 'info' },
  { system: 'RAG-AGENT', message: 'Index rebuilt: 847 documents, 2.3M vectors', type: 'success' },
  { system: 'RAG-AGENT', message: 'Retrieval accuracy: 94.2% (golden set)', type: 'accent' },
  { system: 'AUTO-DATA', message: 'Playwright scraper initialized: 8 workers', type: 'info' },
  { system: 'AUTO-DATA', message: 'Batch collected: 10,247 records', type: 'success' },
  { system: 'AUTO-DATA', message: 'Normalized and deduplicated: 9,891 unique', type: 'info' },
  { system: 'AZURE-OPENAI', message: 'Token consumption this hour: 847K', type: 'warn' },
  { system: 'AZURE-OPENAI', message: 'Semantic cache hit rate: 73%', type: 'accent' },
  { system: 'GUARDRAIL', message: 'PII redaction: 3 fields masked', type: 'warn' },
  { system: 'GUARDRAIL', message: 'Out-of-scope query blocked: DROP TABLE', type: 'accent' },
  { system: 'N8N', message: 'Workflow triggered: weekly_report_pipeline', type: 'info' },
  { system: 'N8N', message: 'Execution completed: 14 nodes, 2.3s', type: 'success' },
  { system: 'SYSTEM', message: 'All pipelines nominal', type: 'accent' },
  { system: 'SYSTEM', message: 'Uptime: 99.97% (last 30 days)', type: 'info' },
];

const TYPE_COLORS: Record<LogType, string> = {
  info: 'text-[#E9EDE6]/40',
  success: 'text-[#C6F24E]/70',
  warn: 'text-[#E9EDE6]/50',
  accent: 'text-[#C6F24E]',
};

const TYPE_PREFIX: Record<LogType, string> = {
  info: '',
  success: '✓ ',
  warn: '⚠ ',
  accent: '▸ ',
};

const STATIC_TIME = '--:--:--';

export default function SystemMonitor() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [typingLine, setTypingLine] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const logIndexRef = useRef(0);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const addLog = () => {
    const template = LOG_LINES[logIndexRef.current % LOG_LINES.length];
    const entry: LogEntry = {
      ...template,
      timestamp: getTimestamp(),
    };

    setLogs((prev) => {
      const next = [...prev, entry];
      if (next.length > 12) next.shift();
      return next;
    });

    logIndexRef.current++;
  };

  const typeNextLine = () => {
    if (isTyping) return;
    
    const template = LOG_LINES[logIndexRef.current % LOG_LINES.length];
    const fullLine = `[${getTimestamp()}] ${template.system}: ${template.message}`;
    let charIndex = 0;

    setIsTyping(true);
    setTypingLine('');

    const typeChar = () => {
      if (charIndex <= fullLine.length) {
        setTypingLine(fullLine.slice(0, charIndex));
        charIndex++;
        const timeout = setTimeout(typeChar, 14 + Math.random() * 18);
        typingTimeoutRef.current = timeout;
      } else {
        const timeout = setTimeout(() => {
          addLog();
          setTypingLine('');
          setIsTyping(false);
          const nextTimeout = setTimeout(typeNextLine, 800 + Math.random() * 1200);
          typingTimeoutRef.current = nextTimeout;
        }, 300);
        typingTimeoutRef.current = timeout;
      }
    };

    typeChar();
  };

  useEffect(() => {
    if (!mounted) return;

    const initial = LOG_LINES.slice(0, 5).map((l) => ({
      ...l,
      timestamp: getTimestamp(),
    }));
    setLogs(initial);
    logIndexRef.current = 5;

    const timer = setTimeout(typeNextLine, 1500);

    return () => {
      clearTimeout(timer);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [mounted]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, typingLine]);

  const displayTime = mounted ? getTimestamp() : STATIC_TIME;

  return (
    <div 
      className="flex flex-col w-full max-w-[340px] h-[320px] sm:h-[380px] lg:h-[420px] mx-auto lg:mx-0 relative select-none"
      style={{
        animation: 'monitorFloat 4s ease-in-out infinite',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="w-2 h-2 rounded-full bg-[#C6F24E] animate-pulse" />
        <span className="font-mono text-[10px] text-[#E9EDE6]/30 uppercase tracking-wider">Live Pipeline Monitor</span>
        <div className="flex-1" />
        <span className="font-mono text-[10px] text-[#E9EDE6]/20">v2.4.1</span>
      </div>

      {/* Terminal body */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden font-mono text-[11px] leading-[1.6] space-y-0.5"
      >
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2 animate-fade-in">
            <span className="text-[#E9EDE6]/20 shrink-0">[{log.timestamp}]</span>
            <span className={`${TYPE_COLORS[log.type]} break-all`}>
              {TYPE_PREFIX[log.type]}{log.system}: {log.message}
            </span>
          </div>
        ))}

        {/* Currently typing line */}
        {typingLine && (
          <div className="flex gap-2">
            <span className="text-[#E9EDE6]/20 shrink-0">[{displayTime}]</span>
            <span className="text-[#E9EDE6]/60 whitespace-pre-wrap break-all">
              {typingLine}
              <span className="inline-block w-2 h-4 bg-[#C6F24E] ml-0.5 animate-pulse align-middle" />
            </span>
          </div>
        )}

        {/* Idle cursor */}
        {!isTyping && !typingLine && mounted && (
          <div className="flex gap-2">
            <span className="text-[#E9EDE6]/20 shrink-0">[{displayTime}]</span>
            <span className="text-[#E9EDE6]/30">
              <span className="inline-block w-2 h-4 bg-[#C6F24E]/50 ml-0.5 animate-pulse align-middle" />
            </span>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="mt-3 flex items-center gap-3 px-1 pt-2 border-t border-[#E9EDE6]/5">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#C6F24E]/60" />
          <span className="font-mono text-[9px] text-[#E9EDE6]/25">3 active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#E9EDE6]/20" />
          <span className="font-mono text-[9px] text-[#E9EDE6]/25">12 queued</span>
        </div>
        <div className="flex-1" />
        <span className="font-mono text-[9px] text-[#E9EDE6]/20">DXB</span>
      </div>
    </div>
  );
}