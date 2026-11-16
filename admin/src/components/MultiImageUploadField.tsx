import React, { useState } from 'react';
import { ImageUploadButton } from './ImageUploadButton';
import { Trash2, Plus } from 'lucide-react';

interface MultiImageUploadFieldProps {
  label: string;
  images: string[];
  onChange: (images: string[]) => void;
}

// Reusable "gallery" control for any section that should hold more than one
// image (as opposed to ImageUploadButton, which only ever sets a single
// string field). Each image can be uploaded from disk or pasted as a URL;
// order is preserved as entered, and any image can be removed individually.
export const MultiImageUploadField: React.FC<MultiImageUploadFieldProps> = ({ label, images, onChange }) => {
  const [newUrl, setNewUrl] = useState('');

  const addImage = (url: string) => {
    if (!url.trim()) return;
    onChange([...images, url.trim()]);
    setNewUrl('');
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-slate-700">{label}</label>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, idx) => (
            <div key={idx} className="group relative h-20 w-28 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute right-1 top-1 rounded-md bg-rose-600/90 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                title="Remove image"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <ImageUploadButton label="Upload Image" onImageUploaded={(url) => addImage(url)} />
        <input
          type="text"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addImage(newUrl);
            }
          }}
          placeholder="or paste an image URL and press Enter"
          className="min-w-[200px] flex-1 rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => addImage(newUrl)}
          className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-200"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
    </div>
  );
};
