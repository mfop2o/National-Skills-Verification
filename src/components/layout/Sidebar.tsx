'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserIcon,
  FolderIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckBadgeIcon,
  MagnifyingGlassIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../lib/hooks/useAuth';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
  badge?: number;
}

interface SidebarProps {
  children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Define navigation items based on user role
  const getNavigation = (): NavigationItem[] => {
    if (!user) return [];

    switch (user.role) {
      case 'user':
        return [
          { name: 'Dashboard', href: '/user/dashboard', icon: HomeIcon },
          { name: 'My Portfolio', href: '/user/portfolio', icon: FolderIcon },
          { name: 'Certificates', href: '/user/certificates', icon: AcademicCapIcon, badge: 3 },
          { name: 'Skills & Badges', href: '/user/skills', icon: ShieldCheckIcon, badge: 5 },
          { name: 'Profile', href: '/user/profile', icon: UserIcon },
        ];
      
      case 'institution':
        return [
          { name: 'Dashboard', href: '/institution/dashboard', icon: HomeIcon },
          { name: 'Verification Queue', href: '/institution/verifications', icon: ClockIcon, badge: 7 },
          { name: 'In Review', href: '/institution/verifications?status=in_review', icon: DocumentCheckIcon },
          { name: 'Issued Badges', href: '/institution/badges', icon: CheckBadgeIcon },
          { name: 'Analytics', href: '/institution/analytics', icon: ChartBarIcon },
          { name: 'Profile', href: '/institution/profile', icon: BuildingOfficeIcon },
        ];
      
      case 'employer':
        return [
          { name: 'Dashboard', href: '/employer/dashboard', icon: HomeIcon },
          { name: 'Search Talent', href: '/employer/search', icon: MagnifyingGlassIcon },
          { name: 'Saved Searches', href: '/employer/saved-searches', icon: FolderIcon },
          { name: 'Verify Credential', href: '/employer/verify', icon: ShieldCheckIcon },
          { name: 'Profile', href: '/employer/profile', icon: BriefcaseIcon },
        ];
      
      case 'admin':
        return [
          { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
          { name: 'Institutions', href: '/admin/institutions', icon: BuildingOfficeIcon },
          { name: 'Users', href: '/admin/users', icon: UserIcon },
          { name: 'Verifications', href: '/admin/verifications', icon: DocumentCheckIcon },
          { name: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldCheckIcon },
          { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
        ];
      
      default:
        return [];
    }
  };

  const navigation = getNavigation();

  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ');
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
                    <span className="ml-2 text-xl font-bold text-gray-900">SkillTrust</span>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={classNames(
                                  pathname === item.href
                                    ? 'bg-gray-50 text-indigo-600'
                                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                )}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <item.icon
                                  className={classNames(
                                    pathname === item.href ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                    'h-6 w-6 shrink-0'
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                                {item.badge && (
                                  <span className="ml-auto bg-indigo-100 text-indigo-600 py-0.5 px-2 rounded-full text-xs">
                                    {item.badge}
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="mt-auto">
                        <button
                          onClick={handleLogout}
                          className="flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                          <ArrowRightOnRectangleIcon className="h-6 w-6 shrink-0 text-red-500" />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">SkillTrust</span>
          </div>
          
          {/* User info */}
          <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900 border-b border-gray-200">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-sm font-medium text-indigo-600">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={classNames(
                          pathname === item.href
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            pathname === item.href ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                        {item.badge && (
                          <span className="ml-auto bg-indigo-100 text-indigo-600 py-0.5 px-2 rounded-full text-xs font-medium">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <button
                  onClick={handleLogout}
                  className="flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6 shrink-0 text-red-500" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
            {/* Add any header content here */}
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}