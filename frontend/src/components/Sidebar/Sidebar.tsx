import React from 'react';
import { Trash2, Plus, X } from 'lucide-react';
import { Logo } from './Logo';
import { DocumentStatus } from './DocumentStatus';
import { AboutSection } from './AboutSection';
import { DropZone } from '../Upload/DropZone';
import { UploadButton } from '../Upload/UploadButton';
import { DocumentInfo } from '../../types';

interface SidebarProps {
  document: DocumentInfo | null;
  onUpload: (file: File) => void;
  isUploading: boolean;
  uploadError: string | null;
  onClearChat: () => void;
  onNewChat: () => void;
  isCreatingConversation: boolean;
  conversationError: string | null;
  hasMessages: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  document,
  onUpload,
  isUploading,
  uploadError,
  onClearChat,
  onNewChat,
  isCreatingConversation,
  conversationError,
  hasMessages,
  isOpenMobile = false,
  onCloseMobile,
}) => {
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
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-5 overflow-y-auto pr-1 custom-scrollbar">

          {/* Header & Mobile Close */}
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
                {isCreatingConversation ? 'Starting New Chat...' : 'New Chat'}
              </span>
            </button>

            {conversationError && (
              <p className="text-[11px] text-red-600 bg-red-50 border border-red-200/60 p-2 rounded-xl text-center">
                {conversationError}
              </p>
            )}
          </div>

          {/* Upload Document Section */}
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

          {/* Current Document Section */}
          <DocumentStatus document={document} />

          {/* Clear Chat Action */}
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

        {/* About Section Footer */}
        <div className="pt-3 mt-auto">
          <AboutSection />
        </div>
      </aside>
    </>
  );
};