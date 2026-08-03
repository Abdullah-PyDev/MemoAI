export interface DocumentInfo {
  documentId: string;
  filename: string;
  pages?: number;
  uploadTime: Date;
  sizeBytes?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  pages?: number;
  filename?: string;
  isError?: boolean;
}

export interface UploadResponse {
  document_id: string;
}

export interface AskPDFRequest {
  document_id: string;
  question: string;
}

export interface AskPDFResponse {
  question: string;
  answer: string;
  filename: string;
  pages: number;
}
