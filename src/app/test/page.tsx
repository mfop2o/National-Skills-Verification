

import { useAuth } from '../../lib/hooks/useAuth';
import Link from 'next/link';

export default function TestPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">System Test Page</h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Configuration Status
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">API URL</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {process.env.NEXT_PUBLIC_API_URL || 'Not set'}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Authentication</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user ? (
                    <span className="text-green-600">✅ Logged in as {user.name}</span>
                  ) : (
                    <span className="text-yellow-600">⚠️ Not logged in</span>
                  )}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">React Query</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className="text-green-600">✅ Installed</span>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Available Routes</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="list-disc pl-5 space-y-1">
                    <li><Link href="/" className="text-indigo-600 hover:text-indigo-900">Home</Link></li>
                    <li><Link href="/login" className="text-indigo-600 hover:text-indigo-900">Login</Link></li>
                    <li><Link href="/register" className="text-indigo-600 hover:text-indigo-900">Register</Link></li>
                    <li><Link href="/user/dashboard" className="text-indigo-600 hover:text-indigo-900">User Dashboard</Link></li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}