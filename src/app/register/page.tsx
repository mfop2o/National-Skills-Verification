

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../lib/hooks/useAuth';
import { ShieldCheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  password_confirmation: z.string(),
  role: z.enum(['user', 'institution', 'employer']),
  region: z.string().optional(),
  city: z.string().optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

type RegisterForm = z.infer<typeof registerSchema>;

// Type for server validation errors
interface ServerValidationError {
  [key: string]: string[];
}

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<ServerValidationError>({});
  const [selectedRole, setSelectedRole] = useState<'user' | 'institution' | 'employer'>('user');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'user',
    },
  });

  const watchRole = watch('role');

  // Update selected role when role changes via form
  useEffect(() => {
    setSelectedRole(watchRole as 'user' | 'institution' | 'employer');
  }, [watchRole]);

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      setServerErrors({}); // Clear previous server errors
      
      console.log('Submitting registration form with data:', {
        ...data,
        password: '[HIDDEN]',
        password_confirmation: '[HIDDEN]'
      });
      
      await registerUser(data);
      toast.success('Registration successful! Please check your email to verify your account.');
      
      // Redirect to login with success message
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 2000);
      
    } catch (error: any) {
      console.error('Registration form error:', error);
      
      // Handle server validation errors
      if (error.response?.status === 422) {
        const serverErrorData = error.response.data;
        
        // Laravel-style validation errors
        if (serverErrorData.errors) {
          setServerErrors(serverErrorData.errors);
          
          // Map server errors to form fields
          Object.entries(serverErrorData.errors).forEach(([field, messages]) => {
            const message = Array.isArray(messages) ? messages[0] : messages;
            
            // Map server field names to form field names if they differ
            let formField = field;
            if (field === 'password_confirmation' || field === 'confirm_password') {
              formField = 'password_confirmation';
            }
            
            // Set error in react-hook-form
            setError(formField as any, {
              type: 'server',
              message: message as string,
            });
          });
          
          // Show first error in toast
          const firstErrorField = Object.keys(serverErrorData.errors)[0];
          const firstErrorMessage = serverErrorData.errors[firstErrorField][0];
          toast.error(firstErrorMessage);
        } 
        // Custom error message
        else if (serverErrorData.message) {
          toast.error(serverErrorData.message);
        } 
        else {
          toast.error('Validation failed. Please check your input.');
        }
      } 
      // Handle duplicate email
      else if (error.response?.status === 409) {
        toast.error('This email is already registered. Please use a different email or try logging in.');
        setServerErrors({ email: ['Email already exists'] });
        setError('email', {
          type: 'server',
          message: 'Email already registered',
        });
      }
      // Handle other errors
      else {
        toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get field error
  const getFieldError = (fieldName: string) => {
    // Check react-hook-form errors first
    if (errors[fieldName as keyof RegisterForm]) {
      return errors[fieldName as keyof RegisterForm]?.message;
    }
    // Then check server errors
    if (serverErrors[fieldName]) {
      return serverErrors[fieldName][0];
    }
    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <ShieldCheckIcon className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              sign in to existing account
            </Link>
          </p>
        </div>

        {/* Display general server error if any */}
        {Object.keys(serverErrors).length > 0 && !Object.keys(errors).length && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  There were errors with your submission
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {Object.entries(serverErrors).map(([field, messages]) => (
                      <li key={field}>
                        {field}: {messages[0]}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a: <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  setValue('role', 'user');
                }}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  selectedRole === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue('role', 'institution');
                }}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  selectedRole === 'institution'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Institution
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue('role', 'employer');
                }}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  selectedRole === 'employer'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Employer
              </button>
            </div>
            {getFieldError('role') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('role')}</p>
            )}
          </div>

          {/* Common Fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name')}
                id="name"
                type="text"
                className={`mt-1 block w-full px-3 py-2 border ${
                  getFieldError('name') ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                aria-invalid={!!getFieldError('name')}
              />
              {getFieldError('name') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                className={`mt-1 block w-full px-3 py-2 border ${
                  getFieldError('email') ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                aria-invalid={!!getFieldError('email')}
              />
              {getFieldError('email') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                {...register('phone')}
                id="phone"
                type="tel"
                className={`mt-1 block w-full px-3 py-2 border ${
                  getFieldError('phone') ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                aria-invalid={!!getFieldError('phone')}
              />
              {getFieldError('phone') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('phone')}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                className={`mt-1 block w-full px-3 py-2 border ${
                  getFieldError('password') ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                aria-invalid={!!getFieldError('password')}
              />
              {getFieldError('password') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters with 1 uppercase letter and 1 number
              </p>
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                {...register('password_confirmation')}
                id="password_confirmation"
                type="password"
                className={`mt-1 block w-full px-3 py-2 border ${
                  getFieldError('password_confirmation') ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                aria-invalid={!!getFieldError('password_confirmation')}
              />
              {getFieldError('password_confirmation') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('password_confirmation')}</p>
              )}
            </div>
          </div>

          {/* Location Fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                Region
              </label>
              <select
                {...register('region')}
                id="region"
                className={`mt-1 block w-full px-3 py-2 border ${
                  getFieldError('region') ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              >
                <option value="">Select Region</option>
                <option value="Addis Ababa">Addis Ababa</option>
                <option value="Oromia">Oromia</option>
                <option value="Amhara">Amhara</option>
                <option value="SNNPR">SNNPR</option>
                <option value="Tigray">Tigray</option>
                <option value="Sidama">Sidama</option>
                <option value="Afar">Afar</option>
                <option value="Somali">Somali</option>
                <option value="Benishangul-Gumuz">Benishangul-Gumuz</option>
                <option value="Gambela">Gambela</option>
                <option value="Harari">Harari</option>
                <option value="Dire Dawa">Dire Dawa</option>
              </select>
              {getFieldError('region') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('region')}</p>
              )}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                {...register('city')}
                id="city"
                type="text"
                className={`mt-1 block w-full px-3 py-2 border ${
                  getFieldError('city') ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {getFieldError('city') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('city')}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}