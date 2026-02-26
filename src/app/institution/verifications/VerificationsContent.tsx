'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useGet } from '../../../lib/hooks/useApi';
import { StatusBadge } from '../../../components/ui/Badge';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import {
  MagnifyingGlassIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

interface Verification {
  id: number;
  verification_number: string;
  portfolio_item: {
    id: number;
    title: string;
    type: string;
    description: string;
    file_path?: string;
    user: {
      id: number;
      name: string;
      email: string;
      phone: string;
    };
  };
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  created_at: string;
  remarks?: string;
}

interface PaginatedResponse {
  data: Verification[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

export default function VerificationsContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || 'pending';

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useGet<PaginatedResponse>(
    ['verifications', status, page.toString(), search],
    `/institution/verifications?status=${status}&page=${page}&search=${search}`
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Verification Queue
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and verify user credentials
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          
          {/* Status Tabs */}
          <div className="flex space-x-2">
            {['pending', 'in_review', 'approved', 'rejected'].map((s) => (
              <Link
                key={s}
                href={`/institution/verifications?status=${s}`}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  status === s
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}
              </Link>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user or credential..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {data?.data?.length ? (
          <div className="divide-y divide-gray-200">
            {data.data.map((verification) => (
              <div key={verification.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {verification.portfolio_item.title}
                      </h3>
                      <StatusBadge status={verification.status} />
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      {verification.portfolio_item.user.name} •{' '}
                      {new Date(
                        verification.created_at
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <Link
                    href={`/institution/verifications/${verification.id}`}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <ClipboardDocumentCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No verifications
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No {status} verifications found.
            </p>
          </div>
        )}

        {/* Pagination */}
        {data && data.last_page > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm">
              Page {page} of {data.last_page}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === data.last_page}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}