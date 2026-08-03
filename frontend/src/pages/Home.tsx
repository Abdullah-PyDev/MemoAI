import React, { useState } from 'react';
import { usePDFChat } from '../hooks/usePDFChat';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { ChatArea } from '../components/Chat/ChatArea';

export const Home: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const {
    currentDocument,
    messages,
    isUploading,
    uploadError,
    isAsking,
    handleUpload,
    handleAskQuestion,
    handleClearChat,
  } = usePDFChat();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-zinc-900 font-sans antialiased">
      {/* Sidebar - fixed 320px width on desktop */}
      <Sidebar
        document={currentDocument}
        onUpload={handleUpload}
        isUploading={isUploading}
        uploadError={uploadError}
        onClearChat={handleClearChat}
        hasMessages={messages.length > 0}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Container - offset by 320px on desktop */}
      <div className="flex-1 flex flex-col h-full min-w-0 lg:pl-[320px]">
        <ChatArea
          document={currentDocument}
          messages={messages}
          isAsking={isAsking}
          onSendMessage={handleAskQuestion}
          onUpload={handleUpload}
          isUploading={isUploading}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />
      </div>
    </div>
  );
};
