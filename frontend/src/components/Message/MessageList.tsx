import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../../types';
import { MessageItem } from './MessageItem';
import { TypingIndicator } from './TypingIndicator';

interface MessageListProps {
  messages: ChatMessage[];
  isAsking?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isAsking = false,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAsking]);

  return (
    <div className="flex flex-col gap-2 p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}

      {isAsking && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  );
};
