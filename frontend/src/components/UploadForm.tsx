import React, { useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner';

interface ResumeFormData {
  name: string;
  currentJobTitle: string;
  currentJobDescription: string;
  currentJobCompany: string;
}

interface UploadFormProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}
const apiUrl = 'https://quick-demo.utsho.dev';

const UploadForm: React.FC<UploadFormProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState<ResumeFormData>({
    name: '',
    currentJobTitle: '',
    currentJobDescription: '',
    currentJobCompany: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${apiUrl}/api/uploadResumeDetails`, formData);
      onSuccess(`Resume uploaded successfully with ID: ${response.data.id}`);
      setFormData({
        name: '',
        currentJobTitle: '',
        currentJobDescription: '',
        currentJobCompany: ''
      });
    } catch (err: any) {
      onError(err.response?.data.error || 'Error uploading resume. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Upload Resume Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Name (First Last):</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Current Job Title:</label>
          <input
            type="text"
            name="currentJobTitle"
            value={formData.currentJobTitle}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Current Job Description:</label>
          <textarea
            name="currentJobDescription"
            value={formData.currentJobDescription}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Current Company:</label>
          <input
            type="text"
            name="currentJobCompany"
            value={formData.currentJobCompany}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner size="small" />
              <span>Uploading...</span>
            </div>
          ) : (
            'Upload Resume'
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;