'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatWindow } from './chat-window';
import type { SiteContent } from '@/lib/types';

export function ChatbotWidget({ siteContent }: { siteContent: SiteContent }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start">
      {isChatOpen && (
        <ChatWindow
          siteContent={siteContent}
          onClose={() => setIsChatOpen(false)}
        />
      )}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={cn(
          'bg-foreground text-background p-4 rounded-full shadow-[0_5px_20px_rgba(25,36,45,0.4)] hover:scale-110 transition-all duration-300 flex items-center justify-center gap-2 group border border-primary/50',
          isChatOpen && 'rotate-12 scale-95 opacity-90'
        )}
        aria-label={isChatOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
      >
        <Sparkles className="text-secondary" size={24} />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 font-bold text-sm hidden md:inline-block text-background">
          Asesor IA
        </span>
      </button>
    </div>
  );
}
