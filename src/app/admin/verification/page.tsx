// This is a Server Component (no 'use client' directive)
import ClientVerificationPage from './ClientVerificationPage';

export const metadata = {
  title: 'Admin Verification',
  description: 'Manage verification requests',
};

export default function VerificationPage() {
  return <ClientVerificationPage />;
}