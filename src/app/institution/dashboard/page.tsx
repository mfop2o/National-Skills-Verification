'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../lib/hooks/useAuth';
import { useGet } from '../../../lib/hooks/useApi';
import Link from 'next/link';
import {
  ClipboardDocumentCheckIcon,
  CheckBadgeIcon,
  ClockIcon,
  XCircleIcon,
  ArrowPathIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { StatusBadge } from '../../../components/ui/Badge';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

interface VerificationItem {
  id: number;
  verification_number: string;
  portfolio_item: {
    id: number;
    title: string;
    type: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  created_at: string;
}

interface DashboardStats {
  total_verifications: number;
  pending_count: number;
  in_review_count: number;
  approved_count: number;
  rejected_count: number;
  recent_verifications: VerificationItem[];
}

export default function InstitutionDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading, error } = useGet<DashboardStats>(
    ['institution-dashboard'],
    '/institution/dashboard'
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading dashboard</p>
      </div>
    );
  }

  // Safe access to stats with default values
  const pendingCount = stats?.pending_count ?? 0;
  const inReviewCount = stats?.in_review_count ?? 0;
  const approvedCount = stats?.approved_count ?? 0;
  const rejectedCount = stats?.rejected_count ?? 0;
  const recentVerifications = stats?.recent_verifications ?? [];

  const statCards = [
    {
      name: 'Pending Verifications',
      value: pendingCount,
      icon: ClockIcon,
      color: 'yellow',
      href: '/institution/verifications?status=pending'
    },
    {
      name: 'In Review',
      value: inReviewCount,
      icon: DocumentMagnifyingGlassIcon,
      color: 'blue',
      href: '/institution/verifications?status=in_review'
    },
    {
      name: 'Approved',
      value: approvedCount,
      icon: CheckBadgeIcon,
      color: 'green',
      href: '/institution/verifications?status=approved'
    },
    {
      name: 'Rejected',
      value: rejectedCount,
      icon: XCircleIcon,
      color: 'red',
      href: '/institution/verifications?status=rejected'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.institution_name || user?.name || 'Institution'}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage credential verifications and issue badges to verified users
        </p>
        {!user?.is_verified_institution && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              ⚠️ Your institution is pending verification. You'll be able to verify credentials once approved.
            </p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
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
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/institution/verifications"
            className="relative block rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-indigo-400 transition-colors"
          >
            <ClipboardDocumentCheckIcon className="mx-auto h-8 w-8 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Review Pending
            </span>
            {pendingCount > 0 && (
              <span className="absolute top-0 right-0 -mt-2 -mr-2 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                {pendingCount}
              </span>
            )}
          </Link>

          <Link
            href="/institution/badges/issue"
            className="relative block rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-indigo-400 transition-colors"
          >
            <CheckBadgeIcon className="mx-auto h-8 w-8 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Issue Badge
            </span>
          </Link>

          <Link
            href="/institution/verifications/history"
            className="relative block rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-indigo-400 transition-colors"
          >
            <ArrowPathIcon className="mx-auto h-8 w-8 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              View History
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Verifications */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Verifications</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentVerifications.length > 0 ? (
            recentVerifications.map((verification: VerificationItem) => (
              <div key={verification.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <p className="text-sm font-medium text-gray-900">
                        {verification.portfolio_item.title}
                      </p>
                      <StatusBadge status={verification.status} />
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>User: {verification.portfolio_item.user.name}</span>
                      <span>•</span>
                      <span>Type: {verification.portfolio_item.type}</span>
                      <span>•</span>
                      <span>Submitted: {new Date(verification.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Link
                    href={`/institution/verifications/${verification.id}`}
                    className="ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Review →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              No recent verifications
            </div>
          )}
        </div>
      </div>
    </div>
  );
}