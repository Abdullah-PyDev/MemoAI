import React from 'react';
import { Menu, FileText, CheckCircle2, Sparkles } from 'lucide-react';
import { DocumentInfo } from '../../types';

interface ChatHeaderProps {
  document: DocumentInfo | null;
  onOpenMobileSidebar: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  document,
  onOpenMobileSidebar,
}) => {
  return (
    <header className="h-14 bg-white/80 backdrop-blur-md border-b border-zinc-200/80 px-4 flex items-center justify-between shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="p-1.5 rounded-xl text-zinc-600 hover:text-black hover:bg-zinc-100 lg:hidden transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-xs font-semibold text-zinc-900 truncate">
              {document ? document.filename : 'MemoAI Chat'}
            </h2>
            <p className="text-[10px] text-zinc-400 truncate">
              {document ? 'Indexed and ready for RAG query' : 'No document uploaded'}
            </p>
          </div>
        </div>
      </div>

      {document && (
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[11px] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ready</span>
          </span>
        </div>
      )}
    </header>
  );
};
