import React, { useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner';

const apiUrl = import.meta.env.VITE_BASE_URL || 'http://resume-dev.utsho.dev:5000';

interface ResumeViewerProps {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

interface ResumeResponse {
  name: string;
  currentJobTitle: string;
  currentJobDescription: string;
  currentJobCompany: string;
}

const ResumeViewer: React.FC<ResumeViewerProps> = ({ onError }) => {
  const [resumeId, setResumeId] = useState('');
  const [resumeDetails, setResumeDetails] = useState<ResumeResponse[] | null>(null);
  const [searchMode, setSearchMode] = useState<'id' | 'name'>('id');
  const [isLoading, setIsLoading] = useState(false);

  const handleRetrieve = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        searchMode === 'id'
          ? `${apiUrl}/api/getResumeById/${resumeId}`
          : `${apiUrl}/api/getResumeByName/${encodeURIComponent(resumeId)}`
      );
      setResumeDetails(response.data);
      onError?.('');
    } catch (err) {
      onError?.('Error retrieving resume. Please check the input and try again.');
      setResumeDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Retrieve Resume</h2>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${searchMode === 'id' ? 'text-blue-600' : 'text-gray-500'}`}>ID</span>
          <button
            onClick={() => {
              setSearchMode(searchMode === 'id' ? 'name' : 'id');
              setResumeId('');
            }}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span
              className={`${searchMode === 'name' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </button>
          <span className={`text-sm ${searchMode === 'name' ? 'text-blue-600' : 'text-gray-500'}`}>Name</span>
        </div>
      </div>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={resumeId}
          onChange={(e) => setResumeId(e.target.value)}
          placeholder={searchMode === 'id' ? "Enter Resume ID" : "Enter Full Name (First Last)"}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleRetrieve}
          disabled={isLoading}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Spinner size="small" />
              <span>Loading...</span>
            </div>
          ) : (
            'Retrieve'
          )}
        </button>
      </div>

      {isLoading && !resumeDetails && (
        <div className="py-12">
          <Spinner size="large" />
        </div>
      )}

      {resumeDetails && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-3">
            Resume Details
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({resumeDetails.length} {resumeDetails.length === 1 ? 'result' : 'results'} found)
            </span>
          </h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {resumeDetails.map((resume, index) => (
              <div key={index} className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <div className="space-y-2">
                  <p>
                    <span className="font-medium text-gray-700">Name:</span>{' '}
                    {resume.name}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Job Title:</span>{' '}
                    {resume.currentJobTitle}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Job Description:</span>{' '}
                    {resume.currentJobDescription}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Company:</span>{' '}
                    {resume.currentJobCompany}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeViewer;