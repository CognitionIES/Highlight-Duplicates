
import React, { useCallback, useState } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        onFileUpload(file);
      }
    }
  }, [onFileUpload]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        onFileUpload(file);
      }
    }
  };

  const isValidFile = (file: File) => {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    return validExtensions.includes(fileExtension);
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">Processing your file...</p>
        <p className="text-sm text-gray-500 mt-1">This may take a moment for large datasets</p>
      </div>
    );
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
        isDragOver
          ? 'border-blue-400 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400 bg-gray-50'
      }`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isProcessing}
      />
      
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className={`p-3 rounded-full transition-colors ${
            isDragOver ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            {isDragOver ? (
              <Upload className="h-8 w-8 text-blue-600" />
            ) : (
              <FileText className="h-8 w-8 text-gray-600" />
            )}
          </div>
        </div>
        
        <div>
          <p className="text-lg font-medium text-gray-700 mb-2">
            {isDragOver ? 'Drop your file here' : 'Choose file or drag & drop'}
          </p>
          <p className="text-sm text-gray-500">
            Supports Excel (.xlsx, .xls) and CSV files
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={isProcessing}
        >
          <Upload className="h-4 w-4 mr-2" />
          Select File
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
