'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useGet } from '../../../../lib/hooks/useApi';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckBadgeIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Candidate {
  id: number;
  name: string;
  region: string;
  city: string;
  profile_photo?: string;
  badges_count: number;
  verified_skills_count: number;
  badges: Array<{
    name: string;
    skill_name: string;
    level: string;
    issuer: string;
  }>;
}

interface SearchResponse {
  data: Candidate[];
  current_page: number;
  last_page: number;
  total: number;
}

interface Skill {
  id: number;
  name: string;
  category: string;
}

export default function SearchContent() {
  const searchParams = useSearchParams();

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('q') || ''
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // ✅ Add missing constants
  const regions = [
    'Addis Ababa',
    'Oromia',
    'Amhara',
    'SNNPR',
    'Tigray',
    'Sidama',
    'Harari',
    'Gambella',
    'Benishangul-Gumuz',
    'Afar',
    'Somali'
  ];

  const levels = ['beginner', 'intermediate', 'advanced', 'expert'];

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (selectedSkills.length)
      params.append('skills', selectedSkills.join(','));
    if (selectedRegion) params.append('region', selectedRegion);
    if (selectedLevel) params.append('level', selectedLevel);
    params.append('page', page.toString());
    return params.toString();
  };

  const { data, isLoading } = useGet<SearchResponse>(
    ['candidate-search', buildQuery()],
    `/employer/candidates?${buildQuery()}`
  );

  const { data: skills } = useGet<Skill[]>(['skills'], '/skills');

  // ✅ FIXED clearFilters
  const clearFilters = () => {
    setSelectedSkills([]);
    setSelectedRegion('');
    setSelectedLevel('');
    setPage(1);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Talent Search
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Find verified candidates based on real skills and credentials
        </p>
      </div>

     <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by skill, job title, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
          >
            <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
            Filters
          </button>
          <Link
            href={`/employer/search?${buildQuery()}`}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Search
          </Link>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Skills Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <select
                  multiple
                  value={selectedSkills}
                  onChange={(e) => setSelectedSkills(
                    Array.from(e.target.selectedOptions, option => option.value)
                  )}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
                >
                  {skills?.map((skill) => (
                    <option key={skill.id} value={skill.name}>
                      {skill.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Regions</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              {/* Skill Level Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Skill Level
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Any Level</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedSkills.length > 0 || selectedRegion || selectedLevel) && (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                    >
                      {skill}
                      <button
                        onClick={() => setSelectedSkills(selectedSkills.filter(s => s !== skill))}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                  {selectedRegion && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                      {selectedRegion}
                      <button
                        onClick={() => setSelectedRegion('')}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  )}
                  {selectedLevel && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                      Level: {selectedLevel}
                      <button
                        onClick={() => setSelectedLevel('')}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  )}
                </div>
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <p className="text-sm text-gray-700">
            Found <span className="font-medium">{data?.total || 0}</span> candidates
          </p>
        </div>

        {data?.data && data.data.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {data.data.map((candidate) => (
              <Link
                key={candidate.id}
                href={`/employer/candidates/${candidate.id}`}
                className="block p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {candidate.profile_photo ? (
                      <img
                        src={`http://localhost:8000/storage/${candidate.profile_photo}`}
                        alt={candidate.name}
                        className="h-12 w-12 rounded-full"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-lg font-medium text-indigo-600">
                          {candidate.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Candidate Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {candidate.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckBadgeIcon className="h-4 w-4 mr-1" />
                          {candidate.verified_skills_count} Verified Skills
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                          {candidate.badges_count} Badges
                        </span>
                      </div>
                    </div>

                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {candidate.city}, {candidate.region}
                    </div>

                    {/* Skills/Badges */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {candidate.badges.map((badge, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {badge.skill_name}
                          {badge.level && (
                            <span className="ml-1 text-xs text-indigo-600">
                              • {badge.level}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>

                    {/* Issuer Info */}
                    {candidate.badges.length > 0 && (
                      <p className="mt-2 text-xs text-gray-500">
                        Verified by: {candidate.badges[0].issuer}
                        {candidate.badges.length > 1 && ' and others'}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filters
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