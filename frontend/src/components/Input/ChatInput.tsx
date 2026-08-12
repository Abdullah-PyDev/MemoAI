import React, { useState, KeyboardEvent, useRef } from 'react';
import { Send, Mic, Sparkles } from 'lucide-react';
import { DocumentInfo } from '../../types';
import { transcribeAudio } from '../../services/speechService';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  document: DocumentInfo | null;
  onUploadClick?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  isLoading = false,
  document,
  onUploadClick,
}) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [microphoneError, setMicrophoneError] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || disabled || isLoading || !document) return;

    onSendMessage(input.trim());
    setInput('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  const startRecording = async () => {
    // Clear previous microphone error
    setMicrophoneError('');

    // Make sure we are not in recording/transcribing state
    setIsRecording(false);
    setIsTranscribing(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
  const audioBlob = new Blob(audioChunksRef.current, {
    type: 'audio/webm',
  });

  stream.getTracks().forEach((track) => track.stop());

  setIsTranscribing(true);

  try {
    const text = await transcribeAudio(audioBlob);
    setInput(text);
  } catch (error) {
    console.error('Transcription error:', error);
  } finally {
    setIsTranscribing(false);
  }
};

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      setIsRecording(true);
    } catch (error) {
      // Permission/access failed
      setIsRecording(false);
      setIsTranscribing(false);

      if (
        error instanceof DOMException &&
        error.name === 'NotAllowedError'
      ) {
        setMicrophoneError(
          'Microphone access was denied. Please allow microphone access in your browser settings to use voice input.'
        );
      } else {
        setMicrophoneError(
          'Unable to access the microphone. Please check your browser settings and try again.'
        );
      }

      console.error('Microphone access error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  

  const suggestions = [
    'Summarize this PDF',
    'What are the key takeaways?',
    'Generate interview questions',
  ];

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-t from-white via-white to-transparent shrink-0">
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-2">

        {/* Quick Suggestion Chips */}
        {document && !input && !isLoading && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[10px] font-semibold uppercase text-gray-400 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-gray-400" />
              Quick Ask:
            </span>

            {suggestions.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => onSendMessage(sug)}
                className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-black px-3 py-1 rounded-full border border-gray-200 shrink-0 transition-all cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Microphone Error Message */}
        {microphoneError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {microphoneError}
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center w-full"
        >
          <div
            className={`flex-1 flex items-center gap-2 bg-white border rounded-2xl px-4 py-3 shadow-lg transition-all ${
              !document
                ? 'border-gray-200 opacity-60 bg-gray-50'
                : 'border-gray-200 focus-within:border-black focus-within:ring-2 focus-within:ring-black/5'
            }`}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              disabled={disabled || isLoading || !document}
              placeholder={
                !document
                  ? 'Please upload a PDF document first to ask questions...'
                  : 'Message MemoAI...'
              }
              rows={1}
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none max-h-36 py-1 font-sans leading-relaxed"
            />

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={
                isTranscribing ||
                disabled ||
                isLoading ||
                !document
              }
              title={
                isRecording
                  ? 'Stop recording'
                  : isTranscribing
                  ? 'Transcribing...'
                  : 'Voice input'
              }
              className={`p-2 rounded-full transition-all shrink-0 ${
                isRecording
                  ? 'bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer'
                  : isTranscribing
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100 cursor-pointer'
              }`}
            >
              {isTranscribing ? (
                <span className="block w-5 h-5 text-xs font-medium">
                  ...
                </span>
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={
                !input.trim() ||
                disabled ||
                isLoading ||
                !document
              }
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 ${
                input.trim() && document && !isLoading
                  ? 'bg-black text-white shadow-md hover:scale-105 active:scale-95 cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        <p className="text-[11px] text-gray-400 text-center mt-1">
          AI can make mistakes. Verify important information against the
          document source.
        </p>
      </div>
    </div>
  );
};