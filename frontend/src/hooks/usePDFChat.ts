import { useState, useCallback } from 'react';
import { ChatMessage, DocumentInfo } from '../types';
import { uploadPDF, askPDF,updateConversationTitle} from '../services/api';
import axios from 'axios';

export function usePDFChat(conversationId: string | null,onConversationTitleUpdate?: (conversationId: string,title: string) => void) {
  const [currentDocument, setCurrentDocument] = useState<DocumentInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  
  
  

  const handleUpload = useCallback(async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      setUploadError('Please select a valid PDF file.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
        if (!conversationId) {
          setUploadError('Please create or select a conversation first.');
          return;
      }
      const response = await uploadPDF(conversationId, file);
      const newDoc: DocumentInfo = {
        documentId: response.document_id,
        filename: file.name,
        uploadTime: new Date(),
        sizeBytes: file.size,
      };

      setCurrentDocument(newDoc);
      // Reset chat history when a new document is uploaded
      setMessages([]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload document. Please try again.';
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [conversationId]);
  const loadConversation = useCallback(async (id: string) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/conversations/${id}`
    );

    const data = response.data;

    

    // Restore messages
    const restoredMessages: ChatMessage[] = [];

    (data.chat || []).forEach((item: any) => {
      restoredMessages.push({
        id: `user_${item.id}`,
        sender: 'user',
        content: item.question,
        timestamp: new Date(item.created_at),
      });

      restoredMessages.push({
        id: `ai_${item.id}`,
        sender: 'assistant',
        content: item.answer,
        timestamp: new Date(item.created_at),
        filename: data.document?.filename,
        pages: data.document?.pages,
      });
    });

    setMessages(restoredMessages);

    // Restore active document ID
    if (data.document) {
      setCurrentDocument({
        documentId: data.document.id,
        filename: data.document.filename,
        uploadTime: new Date(data.document.uploaded_at),
        sizeBytes: 0,
      });
  } else {
    setCurrentDocument(null);
  }
  } catch (error) {
    console.error('Failed to load conversation:', error);
  }
}, []);
  const handleAskQuestion = useCallback(
    async (questionText: string) => {
      const trimmed = questionText.trim();

      if (!trimmed || !currentDocument || isAsking) return;

      const userMsg: ChatMessage = {
        id: 'msg_user_' + Date.now(),
        sender: 'user',
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsAsking(true);

      try {
        if (!conversationId) {
          console.warn('No conversation selected');
          return;
        }

        const response = await askPDF(conversationId, trimmed);
        // Rename the conversation after the first question
        if (conversationId && messages.length === 0) {
          try {
            const title =
              trimmed.length > 40
                ? trimmed.substring(0, 40) + '...'
                : trimmed;

            await updateConversationTitle(conversationId, title);

            onConversationTitleUpdate?.(conversationId, title);
          } catch (error) {
            console.error('Failed to update conversation title:', error);
          }
        }
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
    [currentDocument, isAsking, conversationId, messages,onConversationTitleUpdate,]
  );

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
    handleUpload,
    handleAskQuestion,
    handleClearChat,
    loadConversation,
    
  };
}
