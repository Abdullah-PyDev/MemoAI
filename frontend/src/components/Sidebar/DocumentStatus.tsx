import React from 'react';
import { FileText, CheckCircle, FileCheck2 } from 'lucide-react';
import { DocumentInfo } from '../../types';

interface DocumentStatusProps {
  document: DocumentInfo | null;
}

export const DocumentStatus: React.FC<DocumentStatusProps> = ({ document }) => {
  if (!document) {
    return (
      <div className="p-3.5 rounded-xl bg-zinc-100/50 border border-zinc-200/50 text-center">
        <p className="text-xs text-zinc-400 font-medium">No active document</p>
      </div>
    );
  }

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    return `${Math.round(bytes / 1024)} KB`;
  };

  return (
    <div className="p-3.5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex flex-col gap-2.5 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
          Current Document
        </span>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[11px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Ready
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-xs">
          <FileCheck2 className="w-4 h-4" />
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <h4
            className="text-xs font-semibold text-zinc-900 truncate"
            title={document.filename}
          >
            {document.filename}
          </h4>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-400">
            <span>
              {document.sizeBytes ? formatSize(document.sizeBytes) : 'PDF Document'}
            </span>
            {document.pages && (
              <>
                <span>•</span>
                <span>{document.pages} pages</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
