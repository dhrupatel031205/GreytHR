import React, { useState } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
}

const DocumentUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: UploadedFile}>({});

  const documentTypes = [
    {
      id: 'resume',
      title: 'Resume/CV',
      description: 'Upload your latest resume or curriculum vitae',
      required: true,
      acceptedFormats: '.pdf,.doc,.docx',
    },
    {
      id: 'idProof',
      title: 'Government ID',
      description: 'Driver\'s license, passport, or state ID',
      required: true,
      acceptedFormats: '.pdf,.jpg,.jpeg,.png',
    },
    {
      id: 'addressProof',
      title: 'Address Proof',
      description: 'Utility bill, bank statement, or lease agreement',
      required: true,
      acceptedFormats: '.pdf,.jpg,.jpeg,.png',
    },
    {
      id: 'education',
      title: 'Educational Certificates',
      description: 'Degree certificates, transcripts, or diplomas',
      required: false,
      acceptedFormats: '.pdf,.jpg,.jpeg,.png',
    },
    {
      id: 'experience',
      title: 'Experience Letters',
      description: 'Previous employment letters or certificates',
      required: false,
      acceptedFormats: '.pdf,.doc,.docx',
    },
    {
      id: 'other',
      title: 'Other Documents',
      description: 'Any additional relevant documents',
      required: false,
      acceptedFormats: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
    },
  ];

  const handleFileUpload = (documentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulate file upload
    const uploadedFile: UploadedFile = {
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    };

    setUploadedFiles(prev => ({
      ...prev,
      [documentId]: uploadedFile,
    }));
  };

  const removeFile = (documentId: string) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[documentId];
      return newFiles;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Document Upload Guidelines</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Maximum file size: 10MB per document</li>
          <li>• Accepted formats: PDF, DOC, DOCX, JPG, PNG</li>
          <li>• Ensure documents are clear and readable</li>
          <li>• Required documents must be uploaded to proceed</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documentTypes.map((docType) => {
          const uploadedFile = uploadedFiles[docType.id];
          
          return (
            <div key={docType.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 flex items-center">
                    {docType.title}
                    {docType.required && <span className="text-red-500 ml-1">*</span>}
                  </h4>
                  <p className="text-sm text-gray-600">{docType.description}</p>
                </div>
                {uploadedFile && (
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                )}
              </div>

              {uploadedFile ? (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <File className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(docType.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    {docType.acceptedFormats.replace(/\./g, '').toUpperCase()}
                  </p>
                  <input
                    type="file"
                    accept={docType.acceptedFormats}
                    onChange={(e) => handleFileUpload(docType.id, e)}
                    className="hidden"
                    id={`file-${docType.id}`}
                  />
                  <label
                    htmlFor={`file-${docType.id}`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    Choose File
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">Privacy & Security</h4>
        <p className="text-sm text-yellow-800">
          All uploaded documents are encrypted and stored securely. These documents will only be 
          accessed by authorized HR personnel for verification purposes and will be handled in 
          accordance with our privacy policy.
        </p>
      </div>

      {/* Upload Progress */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Upload Progress</h4>
        <div className="space-y-2">
          {documentTypes.map((docType) => {
            const isUploaded = uploadedFiles[docType.id];
            const isRequired = docType.required;
            
            return (
              <div key={docType.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{docType.title}</span>
                <div className="flex items-center space-x-2">
                  {isRequired && (
                    <span className="text-xs text-red-500">Required</span>
                  )}
                  {isUploaded ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="h-4 w-4 border border-gray-300 rounded-full"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-900">
              Required Documents: {documentTypes.filter(d => d.required && uploadedFiles[d.id]).length} / {documentTypes.filter(d => d.required).length}
            </span>
            <span className="text-gray-600">
              Total: {Object.keys(uploadedFiles).length} / {documentTypes.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;