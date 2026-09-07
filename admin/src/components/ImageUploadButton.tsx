import React, { useRef, useState } from 'react';
import { backendApi } from '../api';
import { Upload, Loader2, CheckCircle2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadButtonProps {
  onImageUploaded: (url: string) => void;
  currentUrl?: string;
  label?: string;
  className?: string;
}

export const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
  onImageUploaded,
  currentUrl,
  label = 'Upload to Database',
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state
    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await backendApi.upload.uploadImage(file);
      onImageUploaded(result.url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('[Upload Error]', err);
      setError('Upload failed. Check MySQL connection.');
      setTimeout(() => setError(null), 4000);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,application/pdf"
        className="hidden"
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all shadow-2xs active:scale-95 ${
          uploading
            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
            : success
            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-300'
            : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-300 hover:border-slate-400'
        }`}
        title="Choose a file from your computer to store directly in MySQL database"
      >
        {uploading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
            <span>Storing in DB...</span>
          </>
        ) : success ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Saved to DB!</span>
          </>
        ) : (
          <>
            <Upload className="w-3.5 h-3.5 text-teal-600" />
            <span>{label}</span>
          </>
        )}
      </button>

      {error && <span className="text-[11px] text-rose-500 font-medium">{error}</span>}
    </div>
  );
};
