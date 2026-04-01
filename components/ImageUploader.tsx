"use client";

import { useCallback, useState } from "react";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  onImagesChange: (imagesBase64: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ onImagesChange, maxImages = 3 }: ImageUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 80% quality to ensure small payload
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          resolve(dataUrl);
        };
        img.onerror = (error) => reject(error);
        img.src = event.target?.result as string;
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    const newFilesCount = Math.min(validFiles.length, maxImages - previews.length);

    if (newFilesCount <= 0) return;

    const filesToProcess = validFiles.slice(0, newFilesCount);
    const base64Images = await Promise.all(filesToProcess.map(fileToBase64));
    
    const nextPreviews = [...previews, ...base64Images];
    setPreviews(nextPreviews);
    onImagesChange(nextPreviews);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [previews, maxImages]
  );

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const nextPreviews = previews.filter((_, idx) => idx !== indexToRemove);
    setPreviews(nextPreviews);
    onImagesChange(nextPreviews);
  };

  return (
    <div className="w-full space-y-4">
      {previews.length < maxImages && (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all w-full
            ${isDragActive 
              ? "border-emerald-500 bg-emerald-50 scale-[1.01]" 
              : "border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50"
            }`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-3 text-slate-500 pointer-events-none">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-600">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-semibold text-slate-700">Click or drag images here</p>
              <p className="text-sm text-slate-400">Up to {maxImages} images (PNG, JPG)</p>
            </div>
          </div>
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {previews.map((preview, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm border border-slate-200">
              <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-700 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
