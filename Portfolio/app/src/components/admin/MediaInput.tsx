import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Link as LinkIcon, X } from 'lucide-react';

interface MediaInputProps {
  label: string;
  value: string | File | null;
  onChange: (value: string | File | null) => void;
  accept?: string;
}

export default function MediaInput({ label, value, onChange, accept = 'image/*' }: MediaInputProps) {
  const [activeMode, setActiveMode] = useState<'url' | 'upload'>('url');
  const [dragActive, setDragActive] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate memory-safe previews for File objects
  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setFilePreview(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setFilePreview(null);
    }
  }, [value]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleFile = (file: File) => {
    onChange(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Validate file type matching simple mime format (e.g. image/*)
      const matchesType = accept.replace('*', '').split(',').some(type => {
        return file.type.startsWith(type.trim());
      });
      if (matchesType || accept === '*') {
        handleFile(file);
      }
    }
  };

  const clearInput = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Display URL string preview or File preview
  const displayPreview = value instanceof File ? filePreview : (typeof value === 'string' ? value : null);

  return (
    <div className="space-y-3 w-full">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium text-[#F5F5F5]">{label}</Label>
        {displayPreview && (
          <span className="text-xs text-[#737373] font-mono">
            {value instanceof File ? `Upload: ${value.name}` : 'URL Loaded'}
          </span>
        )}
      </div>
      
      {/* Premium Switcher */}
      <div className="flex gap-1 p-1 bg-[#0A0A0A] rounded-lg border border-[#1E1E1E]">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setActiveMode('url')}
          className={`flex-1 flex gap-2 items-center justify-center py-1.5 rounded-md text-xs font-mono transition-all duration-300 ${
            activeMode === 'url' 
              ? 'bg-[#1E1E1E] text-[#F5F5F5] border border-[#2A2A2A] shadow-sm' 
              : 'text-[#737373] hover:text-[#CFCFCF] hover:bg-[#0A0A0A]'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          Coller URL
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setActiveMode('upload')}
          className={`flex-1 flex gap-2 items-center justify-center py-1.5 rounded-md text-xs font-mono transition-all duration-300 ${
            activeMode === 'upload' 
              ? 'bg-[#1E1E1E] text-[#F5F5F5] border border-[#2A2A2A] shadow-sm' 
              : 'text-[#737373] hover:text-[#CFCFCF] hover:bg-[#0A0A0A]'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          Uploader fichier
        </Button>
      </div>

      {/* Input modes wrapper */}
      <div className="relative">
        {activeMode === 'url' ? (
          <div className="relative flex items-center">
            <Input
              type="url"
              value={typeof value === 'string' ? value : ''}
              onChange={handleUrlChange}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-[#0A0A0A] border-[#1E1E1E] text-[#F5F5F5] focus:border-[#737373] focus:ring-0 placeholder:text-[#4A4A4A] pr-10 h-10 transition-all duration-200"
            />
            {value && typeof value === 'string' && (
              <button
                type="button"
                onClick={clearInput}
                className="absolute right-3 text-[#737373] hover:text-[#F5F5F5] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative flex flex-col items-center justify-center py-6 px-4 border-2 border-dashed rounded-lg transition-all duration-300 cursor-pointer text-center ${
              dragActive 
                ? 'border-[#2F8F8F] bg-[#2F8F8F]/5 scale-[0.99]' 
                : 'border-[#1E1E1E] bg-[#0A0A0A] hover:border-[#737373] hover:bg-[#0A0A0A]/80'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center space-y-2 pointer-events-none">
              <div className="p-2 rounded-full bg-[#1E1E1E] group-hover:bg-[#2A2A2A] transition-colors">
                <UploadCloud className="w-5 h-5 text-[#737373] group-hover:text-[#F5F5F5] transition-colors" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-[#CFCFCF]">
                  <span className="text-[#B5423F] font-semibold">Cliquez pour téléverser</span> ou glissez-déposez
                </p>
                <p className="text-[10px] text-[#737373] font-mono">
                  Images uniquement (JPEG, PNG, WebP) - Max 5Mo
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Premium Media Preview */}
      {displayPreview && (
        <div className="relative group overflow-hidden rounded-lg border border-[#1E1E1E] hover:border-[#737373] transition-all duration-300">
          <div className="aspect-[16/6] w-full bg-[#0A0A0A] flex items-center justify-center overflow-hidden">
            <img
              src={displayPreview}
              alt="Media Preview"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              onError={(e) => {
                // If it fails to load, hide it
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          
          {/* Overlay actions */}
          <div className="absolute inset-0 bg-[#0A0A0A]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={clearInput}
              className="flex gap-1.5 items-center bg-red-950/80 border border-red-800 text-red-200 hover:bg-red-900 transition-all font-mono text-xs"
            >
              <X className="w-3.5 h-3.5" />
              Retirer le média
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
