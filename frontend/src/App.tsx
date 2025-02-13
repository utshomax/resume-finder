import { useState } from 'react';
import UploadForm from './components/UploadForm';
import ResumeViewer from './components/ResumeViewer';

function App() {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Resume Finder</h1>
        </div>

        <div className='flex gap-2'>
          <div className="flex-1 space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 shadow-sm">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 shadow-sm">
                {successMessage}
              </div>
            )}

            <UploadForm
              onSuccess={(message) => {
                setSuccessMessage(message);
                setError('');
              }}
              onError={(message) => {
                setError(message);
                setSuccessMessage('');
              }}
            />
          </div>

          <ResumeViewer
            onError={(message) => {
              setError(message);
              setSuccessMessage('');
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;