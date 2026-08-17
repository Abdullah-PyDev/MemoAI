import React, { useEffect, useState } from 'react';
import { usePDFChat } from '../hooks/usePDFChat';
import { Sidebar, ConversationInfo } from '../components/Sidebar/Sidebar';
import { ChatArea } from '../components/Chat/ChatArea';
import { createConversation } from '../services/api';




const getConversationGroup = (
  updatedAt: string
): ConversationInfo['updatedAt'] => {
  const updated = new Date(updatedAt);
  const now = new Date();

  const updatedDate = new Date(
    updated.getFullYear(),
    updated.getMonth(),
    updated.getDate()
  );

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const diffDays = Math.floor(
    (today.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  return 'previous';
};

export const Home: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<ConversationInfo[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  useEffect(() => {
  const loadConversations = async () => {
    try {
      const response = await fetch('http://localhost:8000/conversations');

      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();

      console.log('CONVERSATIONS API RESPONSE:', data);

      const mappedConversations: ConversationInfo[] =
        data.conversations.map((conversation: any) => ({
          id: conversation.id,
          title: conversation.title,
          updatedAt: getConversationGroup(conversation.updated_at),
        }));

      setConversations(mappedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  loadConversations();
}, []);
  

  

  const handleConversationTitleUpdate = (
      conversationId: string,
      title: string
    ) => {
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === conversationId
            ? { ...conversation, title }
            : conversation
      )
    );
  };

  const {
    currentDocument,
    messages,
    isUploading,
    uploadError,
    isAsking,
    handleUpload,
    handleAskQuestion,
    handleClearChat,
    loadConversation,
  } = usePDFChat(selectedConversationId,handleConversationTitleUpdate);
  const handleNewChat = async () => {
  try {
    const data = await createConversation();

    const newConversationId = data.conversation_id;

    setSelectedConversationId(newConversationId);

    await loadConversation(newConversationId);

    setConversations((prev) => [
      {
        id: newConversationId,
        title: 'New Conversation',
        updatedAt: 'today',
      },
      ...prev,
    ]);
  } catch (error) {
    console.error('Failed to create new conversation:', error);
  }
};

  const handleSelectConversation = async (id: string) => {
    setSelectedConversationId(id);
    await loadConversation(id);
  };
  

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

        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
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
