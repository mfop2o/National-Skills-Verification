

import { useAuth } from '../../../lib/hooks/useAuth';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

export default function EmployerDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.company_name || user?.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Find verified talent based on real skills and credentials
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by skill, job title, or location..."
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <Link
            href="/employer/search"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Search
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Available Candidates</p>
              <p className="text-2xl font-semibold text-gray-900">1,247</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <CheckBadgeIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Verified Skills</p>
              <p className="text-2xl font-semibold text-gray-900">5,832</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
              <BookmarkIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Saved Searches</p>
              <p className="text-2xl font-semibold text-gray-900">8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Skills */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Top Skills in Demand</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['Software Development', 'Construction', 'Manufacturing', 'Agriculture'].map((skill) => (
            <Link
              key={skill}
              href={`/employer/search?skills=${skill}`}
              className="p-4 border rounded-lg text-center hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <p className="font-medium text-gray-900">{skill}</p>
              <p className="text-sm text-gray-500">150+ candidates</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}