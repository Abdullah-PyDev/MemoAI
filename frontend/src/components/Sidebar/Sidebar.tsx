import React from 'react';
import {
  Trash2,
  Plus,
  X,
  MessageSquare,
  MoreHorizontal,
} from 'lucide-react';

import { Logo } from './Logo';
import { DocumentStatus } from './DocumentStatus';
import { AboutSection } from './AboutSection';
import { DropZone } from '../Upload/DropZone';
import { UploadButton } from '../Upload/UploadButton';
import { DocumentInfo } from '../../types';

export interface ConversationInfo {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface SidebarProps {
  document: DocumentInfo | null;

  onUpload: (file: File) => void;
  isUploading: boolean;
  uploadError: string | null;

  onClearChat: () => void;
  hasMessages: boolean;

  conversations: ConversationInfo[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;

  onNewChat: () => void;
  isCreatingConversation: boolean;
  conversationError: string | null;

  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const getConversationGroup = (updatedAt: string) => {
  const date = new Date(updatedAt);
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  if (date >= startOfToday) {
    return 'today';
  }

  if (date >= startOfYesterday) {
    return 'yesterday';
  }

  return 'previous';
};

export const Sidebar: React.FC<SidebarProps> = ({
  document,
  onUpload,
  isUploading,
  uploadError,
  onClearChat,
  hasMessages,
  conversations,
  selectedConversationId,
  onSelectConversation,
  onNewChat,
  isCreatingConversation,
  conversationError,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const groupedConversations = [
    {
      key: 'today',
      label: 'Today',
      items: conversations.filter(
        (conversation) =>
          getConversationGroup(conversation.updatedAt) === 'today'
      ),
    },
    {
      key: 'yesterday',
      label: 'Yesterday',
      items: conversations.filter(
        (conversation) =>
          getConversationGroup(conversation.updatedAt) === 'yesterday'
      ),
    },
    {
      key: 'previous',
      label: 'Previous 7 days',
      items: conversations.filter(
        (conversation) =>
          getConversationGroup(conversation.updatedAt) === 'previous'
      ),
    },
  ].filter((group) => group.items.length > 0);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 lg:z-10 w-[320px] bg-zinc-50/90 backdrop-blur-md border-r border-zinc-200/80 flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile
            ? 'translate-x-0 shadow-2xl'
            : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-5 overflow-y-auto pr-1 custom-scrollbar">

          {/* Header */}
          <div className="flex items-center justify-between">
            <Logo />

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 lg:hidden"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* New Chat */}
          <div className="flex flex-col gap-2">
            <button
              onClick={onNewChat}
              disabled={isCreatingConversation}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              <Plus className="w-4 h-4" />

              <span>
                {isCreatingConversation
                  ? 'Starting New Chat...'
                  : 'New Chat'}
              </span>
            </button>

            {conversationError && (
              <p className="text-[11px] text-red-600 bg-red-50 border border-red-200/60 p-2 rounded-xl text-center">
                {conversationError}
              </p>
            )}
          </div>

          {/* Conversations */}
          {groupedConversations.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                Conversations
              </span>

              <div className="flex flex-col gap-3">
                {groupedConversations.map((group) => (
                  <div
                    key={group.key}
                    className="flex flex-col gap-1"
                  >
                    <p className="px-1 text-[10px] font-medium uppercase tracking-wide text-zinc-400/80">
                      {group.label}
                    </p>

                    {group.items.map((conversation) => {
                      const isSelected =
                        selectedConversationId === conversation.id;

                      return (
                        <div
                          key={conversation.id}
                          className="group relative flex items-center"
                        >
                          {/* Conversation */}
                          <button
                            onClick={() =>
                              onSelectConversation(conversation.id)
                            }
                            title={conversation.title}
                            className={`w-full flex items-center gap-2 px-2.5 py-1.5 pr-8 rounded-lg text-left text-xs font-medium transition-all ${
                              isSelected
                                ? 'bg-zinc-200/70 text-zinc-900'
                                : 'text-zinc-600 hover:bg-zinc-200/40 hover:text-zinc-900'
                            }`}
                          >
                            <MessageSquare className="w-3.5 h-3.5 shrink-0 text-zinc-400" />

                            <span className="truncate">
                              {conversation.title}
                            </span>
                          </button>

                          {/* Conversation Options */}
                          <button
                            type="button"
                            aria-label="Conversation options"
                            className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-md text-zinc-400 opacity-0 group-hover:opacity-100 hover:bg-zinc-300/60 hover:text-zinc-700 transition-all"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Document */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                Upload Document
              </span>
            </div>

            <DropZone
              onFileSelect={onUpload}
              isLoading={isUploading}
              hasDocument={!!document}
              filename={document?.filename}
            />

            <UploadButton
              onFileSelect={onUpload}
              isLoading={isUploading}
              variant="outline"
              className="w-full py-2.5 text-xs font-medium"
              label={document ? 'Replace PDF' : 'Choose PDF File'}
            />

            {uploadError && (
              <p className="text-[11px] text-red-600 bg-red-50 border border-red-200/60 p-2 rounded-xl text-center">
                {uploadError}
              </p>
            )}
          </div>

          {/* Current Document */}
          <DocumentStatus document={document} />

          {/* Clear Chat */}
          {hasMessages && (
            <button
              onClick={onClearChat}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:text-red-600 hover:bg-red-50/60 border border-transparent hover:border-red-200/50 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Chat History</span>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 mt-auto">
          <AboutSection />
        </div>
      </aside>
    </>
  );
};