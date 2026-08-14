import { useState, useCallback } from 'react';
import { ChatMessage, DocumentInfo } from '../types';
import {
  createConversation,
  uploadPDF,
  askPDF,
} from '../services/api';

export function usePDFChat() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [currentDocument, setCurrentDocument] =
    useState<DocumentInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [conversationError, setConversationError] = useState<string | null>(
    null
  );

  /**
   * Start a completely new conversation.
   * This creates a new conversation on the backend
   * and clears all previous chat state.
   */
  const handleNewChat = useCallback(async () => {
    setIsCreatingConversation(true);
    setConversationError(null);
    setUploadError(null);

    try {
      const newConversationId = await createConversation();

      setConversationId(newConversationId);

      // Clear previous conversation state
      setCurrentDocument(null);
      setMessages([]);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to start a new conversation. Please try again.';

      setConversationError(errorMessage);
    } finally {
      setIsCreatingConversation(false);
    }
  }, []);

  /**
   * Upload a PDF to the current conversation.
   */
  const handleUpload = useCallback(
    async (file: File) => {
      if (!file || file.type !== 'application/pdf') {
        setUploadError('Please select a valid PDF file.');
        return;
      }

      if (!conversationId) {
        setUploadError('Please start a new chat before uploading a PDF.');
        return;
      }

      setIsUploading(true);
      setUploadError(null);

      try {
        const response = await uploadPDF(file, conversationId);

        const newDoc: DocumentInfo = {
          documentId: response.document_id,
          filename: file.name,
          uploadTime: new Date(),
          sizeBytes: file.size,
        };

        setCurrentDocument(newDoc);

        // Reset chat messages when a new document is uploaded
        setMessages([]);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to upload document. Please try again.';

        setUploadError(errorMessage);
      } finally {
        setIsUploading(false);
      }
    },
    [conversationId]
  );

  /**
   * Ask a question about the current PDF.
   */
  const handleAskQuestion = useCallback(
    async (questionText: string) => {
      const trimmed = questionText.trim();

      if (
        !trimmed ||
        !currentDocument ||
        !conversationId ||
        isAsking
      ) {
        return;
      }

      const userMsg: ChatMessage = {
        id: 'msg_user_' + Date.now(),
        sender: 'user',
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsAsking(true);

      try {
        const response = await askPDF(
          currentDocument.documentId,
          trimmed,
          conversationId
        );

        const assistantMsg: ChatMessage = {
          id: 'msg_ai_' + Date.now(),
          sender: 'assistant',
          content: response.answer,
          timestamp: new Date(),
          pages: response.pages,
          filename: response.filename || currentDocument.filename,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err: unknown) {
        const errorContent =
          err instanceof Error
            ? err.message
            : 'An error occurred while getting an answer.';

        const errorMsg: ChatMessage = {
          id: 'msg_err_' + Date.now(),
          sender: 'assistant',
          content: `⚠️ ${errorContent}`,
          timestamp: new Date(),
          isError: true,
        };

        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsAsking(false);
      }
    },
    [currentDocument, conversationId, isAsking]
  );

  /**
   * Clear the current chat.
   */
  const handleClearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    conversationId,
    currentDocument,
    messages,
    isUploading,
    uploadError,
    isAsking,
    isCreatingConversation,
    conversationError,
    handleNewChat,
    handleUpload,
    handleAskQuestion,
    handleClearChat,
  };
}