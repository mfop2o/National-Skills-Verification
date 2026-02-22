'use client';

import { useParams } from 'next/navigation';
import { useGet } from '../../../../../lib/hooks/useApi';
import { LoadingSpinner } from '../../../../../components/ui/LoadingSpinner';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CheckBadgeIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface CandidateProfile {
  name: string;
  region: string;
  city: string;
  bio?: string;
  profile_photo?: string;
  verified_skills: Array<{
    name: string;
    proficiency: string;
    years_experience: number;
  }>;
  badges: Array<{
    name: string;
    skill_name: string;
    level: string;
    issuer: string;
    issued_at: string;
    verification_url: string;
  }>;
  portfolio_items: Array<{
    type: string;
    title: string;
    description: string;
    organization?: string;
    issue_date?: string;
  }>;
}

export default function CandidateProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const { data: profile, isLoading, error } = useGet<CandidateProfile>(
    ['candidate-profile', id],
    `/employer/candidates/${id}`
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading profile</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Candidate not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
        <div className="px-6 py-4 relative">
          <div className="flex items-end -mt-16">
            <div className="flex-shrink-0">
              {profile.profile_photo ? (
                <img
                  src={`http://localhost:8000/storage/${profile.profile_photo}`}
                  alt={profile.name}
                  className="h-24 w-24 rounded-full border-4 border-white"
                />
              ) : (
                <div className="h-24 w-24 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center">
                  <span className="text-3xl font-medium text-indigo-600">
                    {profile.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-4 pb-2">
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {profile.city}, {profile.region}
              </div>
            </div>
          </div>

          {profile.bio && (
            <div className="mt-4">
              <p className="text-gray-700">{profile.bio}</p>
            </div>
          )}

          {/* Trust Score */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-1" />
              <span className="text-sm font-medium text-gray-900">
                Trust Score: High
              </span>
            </div>
            <div className="flex items-center">
              <CheckBadgeIcon className="h-5 w-5 text-indigo-500 mr-1" />
              <span className="text-sm font-medium text-gray-900">
                {profile.verified_skills.length} Verified Skills
              </span>
            </div>
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 text-purple-500 mr-1" />
              <span className="text-sm font-medium text-gray-900">
                {profile.badges.length} Badges
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Skills */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Verified Skills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profile.verified_skills.map((skill, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{skill.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Verified
                </span>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  Proficiency: <span className="font-medium capitalize">{skill.proficiency}</span>
                </p>
                {skill.years_experience && (
                  <p className="text-sm text-gray-600">
                    Experience: <span className="font-medium">{skill.years_experience} years</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Digital Badges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.badges.map((badge, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <ShieldCheckIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{badge.skill_name}</h3>
                  <p className="text-xs text-gray-500">Issued by {badge.issuer}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(badge.issued_at).toLocaleDateString()}
                    </span>
                    {badge.level && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                        {badge.level}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Items */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Portfolio</h2>
        <div className="space-y-4">
          {profile.portfolio_items.map((item, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                </div>
                {item.issue_date && (
                  <span className="text-xs text-gray-500">
                    {new Date(item.issue_date).toLocaleDateString()}
                  </span>
                )}
              </div>
              {item.description && (
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              )}
              {item.organization && (
                <p className="mt-2 text-xs text-gray-500">
                  <BuildingOfficeIcon className="h-4 w-4 inline mr-1" />
                  {item.organization}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Verification Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Verification</h2>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Verify a Credential</h3>
            <p className="text-sm text-blue-600 mb-4">
              Enter a badge ID or verification number to verify this candidate's credentials
            </p>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter badge ID or verification number"
                className="flex-1 px-3 py-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Verify
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Contact Candidate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}