import React from 'react';
import { Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center py-6 px-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200/80 text-zinc-700 text-xs font-medium mb-3">
        <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
        <span>RAG-Powered Document Intelligence</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
        MemoAI
      </h1>
      <p className="text-sm sm:text-base text-zinc-500 max-w-md mt-1.5 font-normal">
        Chat with your PDF documents using AI.
      </p>
    </div>
  );
};
