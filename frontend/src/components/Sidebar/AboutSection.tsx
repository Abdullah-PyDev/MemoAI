import React from 'react';

export const AboutSection: React.FC = () => {
  return (
    <div className="pt-4 border-t border-gray-200 text-[11px] text-gray-400 leading-relaxed">
      <p className="font-semibold text-gray-500 mb-2 uppercase tracking-widest text-[10px]">
        Technical Stack
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-medium text-gray-600">
        <span className="flex items-center gap-1"><span className="text-gray-400">Engine:</span> <strong className="font-semibold text-gray-800">FastAPI</strong></span>
        <span className="flex items-center gap-1"><span className="text-gray-400">LLM:</span> <strong className="font-semibold text-gray-800">Gemini</strong></span>
        <span className="flex items-center gap-1"><span className="text-gray-400">Vector:</span> <strong className="font-semibold text-gray-800">FAISS</strong></span>
        <span className="flex items-center gap-1"><span className="text-gray-400">DB:</span> <strong className="font-semibold text-gray-800">SQLite</strong></span>
      </div>
    </div>
  );
};

