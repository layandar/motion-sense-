import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes = '.txt,.csv',  // ← CHANGED TO .txt,.csv
  maxSize = 50  // ← INCREASED SIZE (sensor data can be larger)
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = acceptedTypes.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
      alert(`Please select a valid file type: ${acceptedTypes}`);
      return false;
    }

    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const handleFileSelect = useCallback((file: File) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);
    setUploadStatus('uploading');
    
    // Immediately send to parent component for actual processing
    onFileSelect(file);
    setUploadStatus('success');
  }, [onFileSelect, maxSize, acceptedTypes]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Upload className="w-8 h-8 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Processing with AI...';
      case 'success':
        return `Successfully uploaded: ${selectedFile?.name}`;
      case 'error':
        return 'Upload failed. Please try again.';
      default:
        return 'Drag and drop your sensor data file here, or click to browse';
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
        isDragOver
          ? 'border-blue-400 bg-blue-50'
          : uploadStatus === 'success'
          ? 'border-green-400 bg-green-50'
          : 'border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-25'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <input
        id="file-input"
        type="file"
        accept={acceptedTypes}
        onChange={handleInputChange}
        className="hidden"
        disabled={uploadStatus === 'uploading'}
      />
      
      <div className="flex flex-col items-center space-y-4">
        {getStatusIcon()}
        <div>
          <p className="text-lg font-medium text-gray-700 mb-2">
            {getStatusMessage()}
          </p>
          <p className="text-sm text-gray-500">
            Supports {acceptedTypes} files with sensor data (6 columns)
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Format: acc_x, acc_y, acc_z, gyro_x, gyro_y, gyro_z
          </p>
        </div>

        {selectedFile && (
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700">
              {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};