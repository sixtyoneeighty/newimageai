"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null);
  const [skipEnhancement, setSkipEnhancement] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    setError(null);
    setImage(null);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, skipEnhancement }),
      });

      const data = await response.json();
      console.log('Image generation response:', data);

      if (response.ok && data.imageUrl) {
        setImage(data.imageUrl);
        setEnhancedPrompt(data.enhancedPrompt);
      } else {
        setError(data.error || 'Failed to generate image');
      }
    } catch (err) {
      setError('Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const clearPrompt = () => {
    setPrompt('');
  };

  const saveImage = () => {
    if (image) {
      const link = document.createElement('a');
      link.href = image;
      link.download = 'generated-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={400}
        height={200}
        className="mb-8"
      />
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <label className="block mb-2 text-gray-700 font-semibold">Prompt:</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Share your vision here. Our AI will refine and enhance your idea to create a stunning image, which will appear below in a few seconds!"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white h-28"
        />
        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={skipEnhancement}
              onChange={(e) => setSkipEnhancement(e.target.checked)}
              className="form-checkbox"
            />
            <span className="ml-2 text-gray-700">Skip Prompt Enhancement</span>
          </label>
        </div>
        <button
          onClick={generateImage}
          disabled={loading}
          className={`mt-4 w-full py-2 px-4 rounded-md text-white font-semibold ${
            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
        <button
          onClick={clearPrompt}
          className="mt-2 w-full py-2 px-4 rounded-md text-white font-semibold bg-gray-700 hover:bg-gray-800"
        >
          Clear
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {image && (
          <div className="mt-8">
            <img
              src={image}
              alt="Generated"
              className="w-full max-w-lg rounded-lg shadow-lg cursor-pointer"
              onClick={() => setLightboxOpen(true)}
              onError={() => setError('Failed to load image')}
            />
          </div>
        )}
        {image && (
          <button
            onClick={saveImage}
            className="mt-4 w-full py-2 px-4 rounded-md text-white font-semibold bg-black hover:bg-gray-800"
          >
            Save Image
          </button>
        )}
        {enhancedPrompt && (
          <div className="mt-4">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full py-2 px-4 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700"
            >
              {dropdownOpen ? 'Hide Enhanced Prompt' : 'Click to see your enhanced prompt'}
            </button>
            {dropdownOpen && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-indigo-700">
                  <strong>Enhanced Prompt:</strong> {enhancedPrompt}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      {image && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={[{ src: image }]}
        />
      )}
    </div>
  );
};

export default ImageGenerator;