import React from 'react';
import { ChatHeader } from './ChatHeader';
import { Hero } from '../Hero/Hero';
import { EmptyState } from '../Hero/EmptyState';
import { MessageList } from '../Message/MessageList';
import { ChatInput } from '../Input/ChatInput';
import { ChatMessage, DocumentInfo } from '../../types';

interface ChatAreaProps {
  document: DocumentInfo | null;
  messages: ChatMessage[];
  isAsking: boolean;
  onSendMessage: (text: string) => void;
  onUpload: (file: File) => void;
  isUploading: boolean;
  onOpenMobileSidebar: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  document,
  messages,
  isAsking,
  onSendMessage,
  onUpload,
  isUploading,
  onOpenMobileSidebar,
}) => {
  const hasMessages = messages.length > 0;

  return (
    <main className="flex-1 flex flex-col h-full min-w-0 bg-white relative">
      <ChatHeader
        document={document}
        onOpenMobileSidebar={onOpenMobileSidebar}
      />

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {hasMessages ? (
          <MessageList messages={messages} isAsking={isAsking} />
        ) : (
          <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            <Hero />
            <EmptyState
              onUpload={onUpload}
              isUploading={isUploading}
              hasDocument={!!document}
              onSelectPrompt={onSendMessage}
            />
          </div>
        )}
      </div>

      <ChatInput
        onSendMessage={onSendMessage}
        isLoading={isAsking}
        document={document}
      />
    </main>
  );
};
