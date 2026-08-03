import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Send, Mic, Sparkles, FileUp } from 'lucide-react';
import { DocumentInfo } from '../../types';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  document: DocumentInfo | null;
  onUploadClick?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  isLoading = false,
  document,
  onUploadClick,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || disabled || isLoading || !document) return;

    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  const suggestions = [
    'Summarize this PDF',
    'What are the key takeaways?',
    'Generate interview questions',
  ];

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-t from-white via-white to-transparent shrink-0">
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-2">
        {/* Quick Suggestion Chips if document exists and input is empty */}
        {document && !input && !isLoading && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[10px] font-semibold uppercase text-gray-400 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-gray-400" />
              Quick Ask:
            </span>
            {suggestions.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => onSendMessage(sug)}
                className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-black px-3 py-1 rounded-full border border-gray-200 shrink-0 transition-all cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Input Form Box */}
        <form onSubmit={handleSubmit} className="relative flex items-center w-full">
          <div
            className={`flex-1 flex items-center gap-2 bg-white border rounded-2xl px-4 py-3 shadow-lg transition-all ${
              !document
                ? 'border-gray-200 opacity-60 bg-gray-50'
                : 'border-gray-200 focus-within:border-black focus-within:ring-2 focus-within:ring-black/5'
            }`}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              disabled={disabled || isLoading || !document}
              placeholder={
                !document
                  ? 'Please upload a PDF document first to ask questions...'
                  : 'Message MemoAI...'
              }
              rows={1}
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none max-h-36 py-1 font-sans leading-relaxed"
            />

            {/* Voice Button (Disabled placeholder) */}
            <button
              type="button"
              disabled
              title="Voice (Not Available)"
              className="p-2 text-gray-300 cursor-not-allowed hover:bg-transparent shrink-0"
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || disabled || isLoading || !document}
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 ${
                input.trim() && document && !isLoading
                  ? 'bg-black text-white shadow-md hover:scale-105 active:scale-95 cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        <p className="text-[11px] text-gray-400 text-center mt-1">
          AI can make mistakes. Verify important information against the document source.
        </p>
      </div>
    </div>
  );
};
