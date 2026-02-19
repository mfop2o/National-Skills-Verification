'use client';

import Link from 'next/link';
import { useAuth } from '@/src/lib/hooks/useAuth';
import { 
  ShieldCheckIcon, 
  UserGroupIcon, 
  AcademicCapIcon,
  BuildingOfficeIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                SkillTrust Ethiopia
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  href={
                    user.role === 'admin' ? '/admin/dashboard' :
                    user.role === 'institution' ? '/institution/dashboard' :
                    user.role === 'employer' ? '/employer/dashboard' :
                    '/user/dashboard'
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
              <span className="block">Verified Skills.</span>
              <span className="block text-indigo-600">Trusted Talent.</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Ethiopia's national platform for skill verification and digital portfolios. 
              Connect verified talent with trusted employers.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-3 text-lg font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Get Started
              </Link>
              <Link
                href="#how-it-works"
                className="px-8 py-3 text-lg font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-500">
              Three simple steps to verify and showcase your skills
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Upload Skills & Certificates</h3>
              <p className="mt-2 text-gray-500">
                Add your qualifications, work experience, and projects to your digital portfolio
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Get Verified by Institutions</h3>
              <p className="mt-2 text-gray-500">
                Authorized institutions verify your credentials and issue digital badges
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Get Hired by Employers</h3>
              <p className="mt-2 text-gray-500">
                Employers search and hire based on verified skills, not just CVs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* For Whom */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Who It's For</h2>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <AcademicCapIcon className="h-12 w-12 text-indigo-600" />
              <h3 className="mt-4 text-xl font-medium text-gray-900">Job Seekers</h3>
              <p className="mt-2 text-gray-500">
                Build verified digital portfolios, earn skill badges, and stand out to employers
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <BuildingOfficeIcon className="h-12 w-12 text-indigo-600" />
              <h3 className="mt-4 text-xl font-medium text-gray-900">Institutions</h3>
              <p className="mt-2 text-gray-500">
                Verify credentials, issue trusted badges, and enhance your institution's credibility
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <UserGroupIcon className="h-12 w-12 text-indigo-600" />
              <h3 className="mt-4 text-xl font-medium text-gray-900">Employers</h3>
              <p className="mt-2 text-gray-500">
                Find verified talent, reduce hiring risk, and make skill-based hiring decisions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted Institutions */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Trusted By</h2>
            <p className="mt-4 text-lg text-gray-500">
              Leading institutions and employers across Ethiopia
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-center">
                <div className="h-12 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <ShieldCheckIcon className="h-8 w-8 text-indigo-400" />
                <span className="ml-2 text-xl font-bold">SkillTrust</span>
              </div>
              <p className="mt-4 text-sm text-gray-400">
                Ethiopia's national platform for verified skills and trusted talent
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">For Individuals</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white">Create Portfolio</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Get Verified</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Earn Badges</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">For Institutions</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white">Partner With Us</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Verification Tools</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Issue Badges</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">For Employers</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white">Search Talent</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Verify Credentials</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Post Jobs</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 SkillTrust Ethiopia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}