import React, { useState } from 'react';

const ClickUpEmbed = () => {
  const [embedUrl, setEmbedUrl] = useState('');
  const [showEmbed, setShowEmbed] = useState(false);

  const handleEmbedSubmit = (e) => {
    e.preventDefault();
    if (embedUrl) {
      setShowEmbed(true);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ClickUp CRM Embed</h1>
        <p className="text-gray-600">Embed your ClickUp workspace directly in your CRM</p>
      </div>

      {!showEmbed ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Setup ClickUp Embed</h2>
          <p className="text-gray-600 mb-4">
            To embed your ClickUp workspace, you'll need to get the shareable link from your ClickUp space or list.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">How to get your ClickUp embed URL:</h3>
            <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
              <li>Go to your ClickUp workspace</li>
              <li>Navigate to the Space or List you want to embed</li>
              <li>Click the "Share" button</li>
              <li>Enable "Public sharing" or "Link sharing"</li>
              <li>Copy the shareable link</li>
              <li>Paste it below</li>
            </ol>
          </div>

          <form onSubmit={handleEmbedSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ClickUp Shareable URL
              </label>
              <input
                type="url"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                placeholder="https://sharing.clickup.com/..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-kioo-primary focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-kioo-primary text-white px-6 py-2 rounded-md hover:bg-kioo-primary/90 transition-colors"
            >
              Embed ClickUp Workspace
            </button>
          </form>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium text-yellow-900 mb-2">Alternative: Create ClickUp Account</h3>
            <p className="text-sm text-yellow-800 mb-3">
              If you don't have a ClickUp account yet, you can create one for free:
            </p>
            <a
              href="https://clickup.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              Create Free ClickUp Account
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">ClickUp Workspace</h2>
            <div className="flex space-x-2">
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-kioo-primary hover:text-kioo-primary/80 text-sm"
              >
                Open in New Tab
              </a>
              <button
                onClick={() => setShowEmbed(false)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Change URL
              </button>
            </div>
          </div>
          
          <div className="relative" style={{ height: '800px' }}>
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              title="ClickUp Workspace"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </div>
      )}

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">ClickUp CRM Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Contact Management</h4>
              <p className="text-sm text-gray-600">Track contacts, deals, and interactions</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Task Automation</h4>
              <p className="text-sm text-gray-600">Automate follow-ups and reminders</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Team Collaboration</h4>
              <p className="text-sm text-gray-600">Share contacts and projects with team</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Advanced Reporting</h4>
              <p className="text-sm text-gray-600">Generate detailed CRM reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClickUpEmbed;