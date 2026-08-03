import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 py-2 px-1 animate-fade-in">
      <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-xs">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-zinc-100 border border-zinc-200/60 rounded-2xl rounded-tl-xs py-3 px-4 flex items-center gap-1.5 shadow-xs">
        <span className="text-xs font-medium text-zinc-500 mr-1">MemoAI is searching document</span>
        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
      </div>
    </div>
  );
};
