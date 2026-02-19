'use client';

import { useState } from 'react';
import axios from 'axios';

export default function CorsTestPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testCors = async () => {
    try {
      // Test without credentials first
      const response = await axios.get('http://localhost:8000/api/cors-test', {
        withCredentials: false
      });
      
      setResult({
        success: true,
        data: response.data,
        headers: {
          'access-control-allow-origin': response.headers['access-control-allow-origin'],
          'access-control-allow-credentials': response.headers['access-control-allow-credentials']
        }
      });
      setError('');
    } catch (err: any) {
      setError(err.message);
      console.error('CORS test failed:', err);
    }
  };

  const testRegistration = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/register', {
        name: 'Test User',
        email: 'test@example.com',
        phone: '251911111111',
        password: 'Password123',
        password_confirmation: 'Password123',
        role: 'user'
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setResult({
        success: true,
        data: response.data
      });
      setError('');
    } catch (err: any) {
      setError(JSON.stringify(err.response?.data || err.message, null, 2));
      console.error('Registration test failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">CORS Test Page</h1>
        
        <div className="space-y-4">
          <button
            onClick={testCors}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mr-4"
          >
            Test CORS Headers
          </button>
          
          <button
            onClick={testRegistration}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Test Registration
          </button>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-green-100 rounded">
            <h2 className="font-bold text-green-800 mb-2">✅ Success:</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-100 rounded">
            <h2 className="font-bold text-red-800 mb-2">❌ Error:</h2>
            <pre className="text-sm overflow-auto text-red-600">
              {error}
            </pre>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded">
          <h2 className="font-bold mb-2">Debug Information:</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Frontend URL: http://localhost:3000</li>
            <li>Backend URL: http://localhost:8000</li>
            <li>withCredentials: true</li>
            <li>Expected CORS headers:</li>
            <ul className="list-circle pl-5">
              <li>Access-Control-Allow-Origin: http://localhost:3000</li>
              <li>Access-Control-Allow-Credentials: true</li>
            </ul>
          </ul>
        </div>
      </div>
    </div>
  );
}