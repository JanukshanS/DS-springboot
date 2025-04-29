import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/env';

const CorsTest = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testCors = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Test with direct axios call
      const response = await axios.get(`${API_URL}/api/test/cors`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      setResult(response.data);
      console.log('CORS Test Success:', response);
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('CORS Test Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white bg-opacity-5 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">CORS Test</h2>
      
      <button
        onClick={testCors}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg mb-4"
      >
        {loading ? 'Testing...' : 'Test CORS'}
      </button>
      
      {error && (
        <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-400 p-3 rounded-lg mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="bg-green-900 bg-opacity-30 border border-green-700 text-green-400 p-3 rounded-lg">
          <p className="font-bold">Success:</p>
          <pre className="mt-2 whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CorsTest;
