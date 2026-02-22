'use client';

import { useAuth } from '../../../lib/hooks/useAuth';
import { useGet } from '../../../lib/hooks/useApi';
import {
  ShieldCheckIcon,
  DocumentCheckIcon,
  BriefcaseIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

interface PortfolioItem {
  id: number;
  type: string;
  title: string;
  status: string;
}

interface Portfolio {
  id: number;
  items: PortfolioItem[];
  views_count: number;
}

export default function UserDashboard() {
  const { user } = useAuth();
  
  const { data: portfolio, isLoading, error } = useGet<Portfolio>(
    ['portfolio'],
    '/portfolio'
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading dashboard data</p>
      </div>
    );
  }

  const verifiedBadges = portfolio?.items?.filter(
    (item) => item.status === 'verified'
  ).length || 0;
  
  const pendingVerifications = portfolio?.items?.filter(
    (item) => item.status === 'pending'
  ).length || 0;

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your portfolio, track verifications, and showcase your skills
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Profile Completion */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BriefcaseIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Profile Completion
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      75%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/user/profile" className="font-medium text-indigo-600 hover:text-indigo-900">
                Complete your profile
              </Link>
            </div>
          </div>
        </div>

        {/* Verified Badges */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShieldCheckIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Verified Badges
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {verifiedBadges}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/user/skills" className="font-medium text-indigo-600 hover:text-indigo-900">
                View all badges
              </Link>
            </div>
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentCheckIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Verifications
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {pendingVerifications}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/user/certificates" className="font-medium text-indigo-600 hover:text-indigo-900">
                Check status
              </Link>
            </div>
          </div>
        </div>

        {/* Portfolio Views */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EyeIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Portfolio Views
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {portfolio?.views_count || 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/user/portfolio" className="font-medium text-indigo-600 hover:text-indigo-900">
                View portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/user/portfolio/add"
            className="relative block rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 transition-colors"
          >
            <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Add portfolio item
            </span>
          </Link>

          <Link
            href="/user/certificates/upload"
            className="relative block rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 transition-colors"
          >
            <DocumentCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Upload certificate
            </span>
          </Link>

          <Link
            href="/user/skills/request"
            className="relative block rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 transition-colors"
          >
            <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Request verification
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {portfolio?.items?.slice(0, 5).map((item) => (
              <li key={item.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.type}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'verified'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : item.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </li>
            ))}
            {(!portfolio?.items || portfolio.items.length === 0) && (
              <li className="px-6 py-4 text-center text-gray-500">
                No recent activity
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}