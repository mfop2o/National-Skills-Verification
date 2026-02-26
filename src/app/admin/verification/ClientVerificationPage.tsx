'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/hooks/useAuth';
import apiClient from '../../../lib/api/client';
import toast from 'react-hot-toast';

interface VerificationRequest {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  document_type: string;
  document_url: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
}

export default function ClientVerificationPage() {
  const { user, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const fetchVerificationRequests = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/verification-requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      toast.error('Failed to load verification requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      await apiClient.post(`/admin/verification-requests/${requestId}/approve`);
      toast.success('Request approved successfully');
      fetchVerificationRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await apiClient.post(`/admin/verification-requests/${requestId}/reject`);
      toast.success('Request rejected');
      fetchVerificationRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Verification Requests</h1>
      
      {requests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No pending verification requests</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{request.user_name}</h3>
                  <p className="text-gray-600">{request.user_email}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  request.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500">Document Type: {request.document_type}</p>
                <p className="text-sm text-gray-500">
                  Submitted: {new Date(request.submitted_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex space-x-3">
                <a
                  href={request.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                >
                  View Document
                </a>
                
                {request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}