'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useGet } from '../../../lib/hooks/useApi';
import { StatusBadge } from '../../../components/ui/Badge';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

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

export default function VerificationsPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || 'pending';
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useGet<PaginatedResponse>(
    ['verifications', status, page.toString(), search],
    `/institution/verifications?status=${status}&page=${page}&search=${search}`
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Verification Queue</h1>
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
                {s === 'pending' && data?.total && (
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    status === s ? 'bg-indigo-500' : 'bg-gray-100'
                  }`}>
                    {data.total}
                  </span>
                )}
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

      {/* Verifications List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {data?.data && data.data.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {data.data.map((verification) => (
              <div key={verification.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {verification.portfolio_item.title}
                      </h3>
                      <StatusBadge status={verification.status} />
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">User</p>
                        <p className="font-medium text-gray-900">
                          {verification.portfolio_item.user.name}
                        </p>
                        <p className="text-gray-600 text-xs">
                          {verification.portfolio_item.user.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Type</p>
                        <p className="font-medium text-gray-900 capitalize">
                          {verification.portfolio_item.type}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Submitted</p>
                        <p className="font-medium text-gray-900">
                          {new Date(verification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Verification #</p>
                        <p className="font-medium text-gray-900 text-xs">
                          {verification.verification_number}
                        </p>
                      </div>
                    </div>

                    {verification.portfolio_item.description && (
                      <div className="mt-2">
                        <p className="text-gray-500 text-sm">Description</p>
                        <p className="text-gray-700 text-sm">
                          {verification.portfolio_item.description}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex flex-col space-y-2">
                    <Link
                      href={`/institution/verifications/${verification.id}`}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 text-center"
                    >
                      Review
                    </Link>
                    
                    {verification.portfolio_item.file_path && (
                      <a
                        href={`http://localhost:8000/storage/${verification.portfolio_item.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 text-center"
                      >
                        View Document
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <ClipboardDocumentCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No verifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              No {status} verifications found.
            </p>
          </div>
        )}

        {/* Pagination */}
        {data && data.last_page > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {page} of {data.last_page}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === data.last_page}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}