'use client';

import { useAuth } from '../../../lib/hooks/useAuth';
import Link from 'next/link';
import {
  ClockIcon,
  CheckBadgeIcon,
  XCircleIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function InstitutionDashboard() {
  const { user } = useAuth();

  const stats = [
    { name: 'Pending', value: '7', icon: ClockIcon, color: 'yellow', href: '/institution/verifications?status=pending' },
    { name: 'In Review', value: '3', icon: DocumentMagnifyingGlassIcon, color: 'blue', href: '/institution/verifications?status=in_review' },
    { name: 'Approved', value: '24', icon: CheckBadgeIcon, color: 'green', href: '/institution/verifications?status=approved' },
    { name: 'Rejected', value: '2', icon: XCircleIcon, color: 'red', href: '/institution/verifications?status=rejected' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.institution_name || user?.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and verify credentials from job seekers
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Verifications */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Verifications</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Bachelor's Degree Certificate</p>
                <p className="text-sm text-gray-500">John Doe • University of Addis Ababa</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                Pending
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}