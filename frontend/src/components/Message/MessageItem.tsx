import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot, Copy, Check, FileText } from 'lucide-react';
import { ChatMessage } from '../../types';

interface MessageItemProps {
  message: ChatMessage;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`flex items-start gap-3 py-3 px-1 transition-all ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
          isUser
            ? 'bg-zinc-100 text-zinc-800 border border-zinc-200'
            : 'bg-black text-white'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Content Container */}
      <div
        className={`flex flex-col max-w-[85%] sm:max-w-[78%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        {/* Header / Meta */}
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-[11px] font-semibold text-zinc-500">
            {isUser ? 'You' : 'MemoAI Assistant'}
          </span>
          <span className="text-[10px] text-zinc-400">{formattedTime}</span>
          {!isUser && message.pages && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded-md border border-zinc-200/60">
              <FileText className="w-3 h-3 text-zinc-400" />
              <span>{message.pages} pages indexed</span>
            </span>
          )}
        </div>

        {/* Bubble */}
        <div
          className={`relative group p-4 rounded-2xl text-xs sm:text-sm leading-relaxed transition-all ${
            isUser
              ? 'bg-black text-white rounded-tr-xs shadow-sm'
              : message.isError
              ? 'bg-red-50 border border-red-200 text-red-800 rounded-tl-xs'
              : 'bg-zinc-50/90 border border-zinc-200/80 text-zinc-800 rounded-tl-xs shadow-xs'
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap font-sans">{message.content}</div>
          ) : (
            <div className="prose prose-xs max-w-none prose-zinc dark:prose-invert">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}

          {/* Copy Action Button */}
          {!isUser && !message.isError && (
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded-lg bg-white/80 border border-zinc-200/80 text-zinc-500 hover:text-black hover:bg-white transition-all"
              title="Copy message"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
