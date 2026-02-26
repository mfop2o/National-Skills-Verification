import { Suspense } from 'react';
import SearchContent from './SearchContent';

export default function TalentSearchPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}