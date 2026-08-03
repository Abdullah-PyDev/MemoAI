import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface UploadButtonProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  label?: string;
}

export const UploadButton: React.FC<UploadButtonProps> = ({
  onFileSelect,
  isLoading = false,
  variant = 'primary',
  className = '',
  label = 'Upload Document',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      e.target.value = '';
    }
  };

  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-black/10';

  const variantStyles = {
    primary:
      'bg-black text-white hover:bg-zinc-800 shadow-sm active:scale-[0.99]',
    secondary:
      'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-200/60',
    outline:
      'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 shadow-xs',
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        <span>{isLoading ? 'Processing PDF...' : label}</span>
      </button>
    </>
  );
};
