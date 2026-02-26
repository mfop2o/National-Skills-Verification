import { Suspense } from 'react';
import VerificationsContent from './VerificationsContent';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

export default function VerificationsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <VerificationsContent />
    </Suspense>
  );
}