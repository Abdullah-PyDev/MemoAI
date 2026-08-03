import React, { useState, DragEvent } from 'react';
import { FileUp, FileText, CheckCircle2 } from 'lucide-react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  hasDocument?: boolean;
  filename?: string;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFileSelect,
  isLoading = false,
  hasDocument = false,
  filename,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (isLoading) return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    if (isLoading) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,application/pdf';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    };
    input.click();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`group relative flex flex-col items-center justify-center p-5 text-center rounded-2xl border transition-all duration-200 cursor-pointer ${
        isDragOver
          ? 'border-black bg-zinc-100/80 scale-[1.01]'
          : 'border-dashed border-zinc-200 hover:border-zinc-400 bg-white hover:bg-zinc-50/50'
      } ${isLoading ? 'pointer-events-none opacity-80' : ''}`}
    >
      {isLoading ? (
        <div className="flex flex-col items-center gap-2 py-2">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium text-zinc-600">Reading & indexing PDF...</span>
        </div>
      ) : hasDocument ? (
        <div className="flex flex-col items-center gap-2 py-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="max-w-[220px]">
            <p className="text-xs font-medium text-zinc-900 truncate">{filename || 'Document Loaded'}</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">Click or drop new PDF to replace</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-1">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-600 flex items-center justify-center transition-transform group-hover:scale-105 group-hover:bg-zinc-200/70">
            {isDragOver ? <FileUp className="w-5 h-5 text-black" /> : <FileText className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-800">
              <span className="text-black font-semibold underline underline-offset-2">Click to upload</span> or drag and drop
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">PDF documents up to 50MB</p>
          </div>
        </div>
      )}
    </div>
  );
};
