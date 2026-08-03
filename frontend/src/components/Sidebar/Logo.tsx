import React from 'react';
import { Sparkles } from 'lucide-react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2.5 px-1 py-1">
      <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white shadow-sm transition-transform hover:scale-105">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-zinc-900 text-lg tracking-tight leading-none">
          MemoAI
        </span>
        <span className="text-[10px] font-medium text-zinc-400 tracking-wider uppercase mt-0.5">
          PDF Intelligence
        </span>
      </div>
    </div>
  );
};
