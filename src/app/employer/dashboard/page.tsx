'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../lib/hooks/useAuth';
import { useGet } from '../../../lib/hooks/useApi';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import {
  MagnifyingGlassIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  BuildingOfficeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  total_searches: number;
  saved_searches: number;
  viewed_profiles: number;
  verified_hires: number;
  recent_searches: any[];
  top_skills: Array<{ skill: string; count: number }>;
}

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

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  const { data: stats, isLoading: statsLoading } = useGet<DashboardStats>(
    ['employer-dashboard'],
    '/employer/dashboard'
  );

  const { data: recommendedCandidates, isLoading: candidatesLoading } = useGet<Candidate[]>(
    ['recommended-candidates'],
    '/employer/candidates/recommended'
  );

  if (statsLoading || candidatesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.company_name || user?.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Find and hire verified talent based on real skills, not just CVs
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by skill, job title, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <Link
            href={`/employer/search?q=${searchQuery}`}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Search
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Total Candidates</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.total_searches || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <CheckBadgeIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Verified Skills</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.verified_hires || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
              <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Companies Hiring</p>
              <p className="text-2xl font-semibold text-gray-900">150+</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <MapPinIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Regions</p>
              <p className="text-2xl font-semibold text-gray-900">All</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Skills in Demand */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Top Skills in Demand</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['Software Development', 'Construction', 'Manufacturing', 'Agriculture'].map((skill) => (
            <Link
              key={skill}
              href={`/employer/search?skills=${skill}`}
              className="p-4 border rounded-lg text-center hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <p className="font-medium text-gray-900">{skill}</p>
              <p className="text-sm text-gray-500">150+ candidates</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended Candidates */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recommended for You</h2>
          <Link href="/employer/search" className="text-sm text-indigo-600 hover:text-indigo-500">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedCandidates?.map((candidate) => (
            <Link
              key={candidate.id}
              href={`/employer/candidates/${candidate.id}`}
              className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {candidate.profile_photo ? (
                    <img
                      src={`http://localhost:8000/storage/${candidate.profile_photo}`}
                      alt={candidate.name}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-600">
                        {candidate.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {candidate.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {candidate.city}, {candidate.region}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <CheckBadgeIcon className="h-4 w-4 text-green-500 mr-1" />
                  {candidate.verified_skills_count} skills
                </span>
                <span className="flex items-center">
                  <BuildingOfficeIcon className="h-4 w-4 text-blue-500 mr-1" />
                  {candidate.badges_count} badges
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {candidate.badges.slice(0, 3).map((badge, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {badge.skill_name}
                  </span>
                ))}
                {candidate.badges.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{candidate.badges.length - 3} more
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/employer/search"
            className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition-colors"
          >
            <MagnifyingGlassIcon className="mx-auto h-6 w-6 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Advanced Search
            </span>
          </Link>

          <Link
            href="/employer/saved-searches"
            className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition-colors"
          >
            <UserGroupIcon className="mx-auto h-6 w-6 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Saved Searches
            </span>
          </Link>

          <Link
            href="/employer/verify"
            className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition-colors"
          >
            <CheckBadgeIcon className="mx-auto h-6 w-6 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Verify Credential
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}