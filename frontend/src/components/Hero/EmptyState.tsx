import React from 'react';
import { Upload, FileText, HelpCircle, Lightbulb, HelpCircle as HelpIcon, ListChecks, ArrowRight } from 'lucide-react';
import { UploadButton } from '../Upload/UploadButton';

interface EmptyStateProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
  hasDocument: boolean;
  onSelectPrompt?: (prompt: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onUpload,
  isUploading,
  hasDocument,
  onSelectPrompt,
}) => {
  const capabilities = [
    {
      title: 'Summarize PDFs',
      description: 'Get concise executive summaries and key takeaway bullet points.',
      prompt: 'Can you give me an executive summary of this document?',
      icon: FileText,
    },
    {
      title: 'Ask questions',
      description: 'Find precise answers grounded directly in document content with citations.',
      prompt: 'What are the main findings or topics discussed in this document?',
      icon: HelpCircle,
    },
    {
      title: 'Explain concepts',
      description: 'Break down complex technical terms or methodologies simply.',
      prompt: 'Explain the core concepts and methodologies mentioned in this PDF.',
      icon: Lightbulb,
    },
    {
      title: 'Generate interview questions',
      description: 'Create technical and analytical evaluation questions based on content.',
      prompt: 'Generate 5 key interview or review questions based on this document.',
      icon: ListChecks,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto py-8 px-4 text-center my-auto">
      <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center mb-5 shadow-md">
        <FileText className="w-7 h-7" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
        {hasDocument ? 'Document Ready to Chat' : 'Welcome to MemoAI'}
      </h2>

      <p className="text-sm text-zinc-500 max-w-md mt-2 mb-6">
        {hasDocument
          ? 'Select a prompt below or type your question to start chatting.'
          : 'Upload a PDF to begin analyzing and asking questions.'}
      </p>

      {!hasDocument && (
        <div className="mb-10 w-full max-w-sm">
          <UploadButton
            onFileSelect={onUpload}
            isLoading={isUploading}
            variant="primary"
            className="w-full py-3.5 text-sm shadow-md"
            label="Upload a PDF to Begin"
          />
        </div>
      )}

      {/* You can section */}
      <div className="w-full text-left">
        <p className="text-xs font-semibold tracking-wider uppercase text-zinc-400 mb-3 text-center sm:text-left">
          You can ask MemoAI to:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <button
                key={cap.title}
                onClick={() => {
                  if (hasDocument && onSelectPrompt) {
                    onSelectPrompt(cap.prompt);
                  }
                }}
                disabled={!hasDocument}
                className={`flex flex-col items-start text-left p-4 rounded-2xl border transition-all ${
                  hasDocument
                    ? 'bg-white hover:bg-zinc-50 border-zinc-200/80 hover:border-black shadow-xs hover:shadow-sm cursor-pointer group'
                    : 'bg-zinc-50/60 border-zinc-200/50 cursor-default opacity-85'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  {hasDocument && (
                    <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-black transition-colors" />
                  )}
                </div>
                <h3 className="text-xs font-semibold text-zinc-900">{cap.title}</h3>
                <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                  {cap.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
