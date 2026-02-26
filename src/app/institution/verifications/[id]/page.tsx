

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGet, usePost } from '../../../../lib/hooks/useApi';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { StatusBadge } from '../../../../components/ui/Badge';
import toast from 'react-hot-toast';
import {
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

interface VerificationDetails {
  id: number;
  verification_number: string;
  portfolio_item: {
    id: number;
    title: string;
    type: string;
    description: string;
    file_path?: string;
    issue_date?: string;
    expiry_date?: string;
    credential_id?: string;
    organization?: string;
    user: {
      id: number;
      name: string;
      email: string;
      phone: string;
      region?: string;
      city?: string;
    };
  };
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  created_at: string;
  remarks?: string;
  rejection_reason?: string;
  institution: {
    id: number;
    name: string;
  };
}

export default function VerificationReviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [remarks, setRemarks] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [issueBadge, setIssueBadge] = useState(true);
  const [badgeName, setBadgeName] = useState('');
  const [badgeLevel, setBadgeLevel] = useState('');

  const { data: verification, isLoading, refetch } = useGet<VerificationDetails>(
    ['verification', id],
    `/institution/verifications/${id}`
  );

  const approveMutation = usePost(`/institution/verifications/${id}/approve`, {
    onSuccess: () => {
      toast.success('Verification approved successfully');
      refetch();
      setTimeout(() => router.push('/institution/verifications'), 2000);
    }
  });

  const rejectMutation = usePost(`/institution/verifications/${id}/reject`, {
    onSuccess: () => {
      toast.success('Verification rejected');
      refetch();
      setTimeout(() => router.push('/institution/verifications'), 2000);
    }
  });

  const startReviewMutation = usePost(`/institution/verifications/${id}/start`, {
    onSuccess: () => {
      toast.success('Review started');
      refetch();
    }
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!verification) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Verification not found</p>
      </div>
    );
  }

  const handleApprove = () => {
    approveMutation.mutate({
      remarks,
      issue_badge: issueBadge,
      badge_name: issueBadge ? badgeName || verification.portfolio_item.title : undefined,
      badge_level: badgeLevel || undefined
    });
  };

  const handleReject = () => {
    if (!rejectionReason) {
      toast.error('Please provide a rejection reason');
      return;
    }
    rejectMutation.mutate({ rejection_reason: rejectionReason });
  };

  const handleStartReview = () => {
    startReviewMutation.mutate({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Review Verification</h1>
            <p className="mt-1 text-sm text-gray-500">
              Verification #{verification.verification_number}
            </p>
          </div>
          <StatusBadge status={verification.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Credential Details */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Credential Details</h2>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Title</dt>
                <dd className="mt-1 text-sm text-gray-900">{verification.portfolio_item.title}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{verification.portfolio_item.type}</dd>
              </div>

              {verification.portfolio_item.organization && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Organization</dt>
                  <dd className="mt-1 text-sm text-gray-900">{verification.portfolio_item.organization}</dd>
                </div>
              )}

              {verification.portfolio_item.issue_date && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Issue Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(verification.portfolio_item.issue_date).toLocaleDateString()}
                  </dd>
                </div>
              )}

              {verification.portfolio_item.credential_id && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Credential ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{verification.portfolio_item.credential_id}</dd>
                </div>
              )}

              <div>
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{verification.portfolio_item.description}</dd>
              </div>
            </dl>
          </div>

          {/* Document Preview */}
          {verification.portfolio_item.file_path && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Document</h2>
              <div className="border rounded-lg p-4 bg-gray-50">
                <a
                  href={`http://localhost:8000/storage/${verification.portfolio_item.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-indigo-600 hover:text-indigo-500"
                >
                  <DocumentTextIcon className="h-6 w-6" />
                  <span>View Document</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - User Info & Actions */}
        <div className="space-y-6">
          {/* User Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">User Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{verification.portfolio_item.user.name}</p>
                  <p className="text-xs text-gray-500">{verification.portfolio_item.user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-900">{verification.portfolio_item.user.phone}</p>
                  {verification.portfolio_item.user.region && (
                    <p className="text-xs text-gray-500">
                      {verification.portfolio_item.user.city}, {verification.portfolio_item.user.region}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-900">Submitted</p>
                  <p className="text-xs text-gray-500">
                    {new Date(verification.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {verification.status === 'pending' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
              <button
                onClick={handleStartReview}
                disabled={startReviewMutation.isPending}
                className="w-full mb-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {startReviewMutation.isPending ? 'Starting...' : 'Start Review'}
              </button>
            </div>
          )}

          {verification.status === 'in_review' && (
            <div className="bg-white shadow rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Review Decision</h2>
              
              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Add any remarks about this verification..."
                />
              </div>

              {/* Badge Options */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={issueBadge}
                    onChange={(e) => setIssueBadge(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Issue a badge upon approval
                  </label>
                </div>

                {issueBadge && (
                  <div className="space-y-3 pl-6">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Badge Name</label>
                      <input
                        type="text"
                        value={badgeName}
                        onChange={(e) => setBadgeName(e.target.value)}
                        placeholder={verification.portfolio_item.title}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Level</label>
                      <select
                        value={badgeLevel}
                        onChange={(e) => setBadgeLevel(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">Select level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {!showRejectForm ? (
                  <>
                    <button
                      onClick={handleApprove}
                      disabled={approveMutation.isPending}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                    >
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      {approveMutation.isPending ? 'Approving...' : 'Approve'}
                    </button>
                    
                    <button
                      onClick={() => setShowRejectForm(true)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      <XCircleIcon className="h-5 w-5 mr-2 inline" />
                      Reject
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Explain why this credential is being rejected..."
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={handleReject}
                        disabled={rejectMutation.isPending}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Reject'}
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowRejectForm(false);
                          setRejectionReason('');
                        }}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {verification.status === 'approved' && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center">
                <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">Approved</h3>
                {verification.remarks && (
                  <p className="mt-1 text-sm text-gray-500">{verification.remarks}</p>
                )}
                <button
                  onClick={() => router.push('/institution/verifications')}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Back to Queue
                </button>
              </div>
            </div>
          )}

          {verification.status === 'rejected' && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center">
                <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">Rejected</h3>
                {verification.rejection_reason && (
                  <p className="mt-1 text-sm text-gray-500">{verification.rejection_reason}</p>
                )}
                <button
                  onClick={() => router.push('/institution/verifications')}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Back to Queue
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}