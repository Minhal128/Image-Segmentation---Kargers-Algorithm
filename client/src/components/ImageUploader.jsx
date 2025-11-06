import React, { useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export function ImageUploader({ onImageSelect, selectedImage, onClear }) {
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-purple-500/20 shadow-2xl overflow-hidden">
      <CardContent className="p-3 sm:p-4 md:p-6">
        {!selectedImage ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="relative border-2 border-dashed border-purple-500/30 rounded-xl p-8 sm:p-12 md:p-16 text-center hover:border-purple-500 hover:bg-purple-500/5 transition-all duration-300 cursor-pointer group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer relative z-10 block">
              <div className="relative inline-block mb-4 md:mb-6">
                <Upload className="mx-auto h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <div className="absolute inset-0 blur-xl bg-purple-500/30 group-hover:bg-purple-500/50 transition-all"></div>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-3 text-gray-200">Drop your image here</p>
              <p className="text-sm sm:text-base text-gray-400 mb-4 md:mb-6 px-2">
                or click to browse from your device
              </p>
              <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg shadow-lg shadow-purple-500/50 rounded-md transition-all cursor-pointer">
                Select Image
              </span>
            </label>
          </div>
        ) : (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl blur-xl"></div>
            <img
              src={selectedImage}
              alt="Selected"
              className="relative w-full h-auto rounded-xl border border-purple-500/30 shadow-2xl"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-red-500/90 hover:bg-red-600 backdrop-blur-sm shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              onClick={onClear}
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
