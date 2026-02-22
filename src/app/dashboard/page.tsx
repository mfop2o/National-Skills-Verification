'use client';

import { useAuth } from '../../lib/hooks/useAuth';
import Link from 'next/link';
import {
  FolderIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

export default function UserDashboard() {
  const { user } = useAuth();

  const stats = [
    { name: 'Portfolio Items', value: '12', icon: FolderIcon, change: '+2', changeType: 'increase' },
    { name: 'Certificates', value: '8', icon: AcademicCapIcon, change: '+3', changeType: 'increase' },
    { name: 'Verified Skills', value: '5', icon: ShieldCheckIcon, change: '+1', changeType: 'increase' },
    { name: 'Profile Views', value: '147', icon: ArrowTrendingUpIcon, change: '+23', changeType: 'increase' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your portfolio, track verifications, and showcase your skills
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/user/portfolio/add"
            className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition-colors"
          >
            <FolderIcon className="mx-auto h-6 w-6 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">Add Portfolio Item</span>
          </Link>
          <Link
            href="/user/certificates/upload"
            className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition-colors"
          >
            <AcademicCapIcon className="mx-auto h-6 w-6 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">Upload Certificate</span>
          </Link>
          <Link
            href="/user/skills/verify"
            className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition-colors"
          >
            <ShieldCheckIcon className="mx-auto h-6 w-6 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">Verify Skills</span>
          </Link>
        </div>
      </div>
    </div>
  );
}