'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../api/client';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../../types/auth';
import toast from 'react-hot-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await apiClient.get('/me');
      setUser(response.data);
      setAuthError(null);
    } catch (error: any) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only show toast if it's not a 401 (unauthorized) error
      if (error.response?.status !== 401) {
        toast.error('Session verification failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthError(null);
      console.log('Login attempt for:', credentials.email);
      
      const response = await apiClient.post<AuthResponse>('/login', credentials);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      toast.success(`Welcome back, ${user.name || user.email}!`);
      
      // Small delay to ensure toast is seen
      setTimeout(() => {
        // Redirect based on role
        switch (user.role) {
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'institution':
            router.push('/institution/dashboard');
            break;
          case 'employer':
            router.push('/employer/dashboard');
            break;
          default:
            router.push('/user/dashboard');
        }
      }, 500);
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle different error scenarios
      if (error.response?.status === 422) {
        // Validation errors
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          // Show first validation error
          const firstError = Object.values(validationErrors)[0] as string[];
          toast.error(firstError[0] || 'Invalid input data');
        } else {
          toast.error('Please check your input and try again');
        }
      } else if (error.response?.status === 401) {
        toast.error('Invalid email or password');
      } else if (error.response?.status === 403) {
        toast.error('Your account has been suspended');
      } else if (error.code === 'ECONNABORTED') {
        toast.error('Connection timeout. Please try again');
      } else if (!error.response) {
        toast.error('Network error. Please check your connection');
      } else {
        toast.error(error.response?.data?.message || 'Login failed');
      }
      
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setAuthError(null);
      console.log('Registration attempt with data:', {
        ...data,
        password: '[HIDDEN]',
        password_confirmation: '[HIDDEN]'
      });

      // Log the exact data being sent to the API
      console.log('Sending to API:', JSON.stringify(data, null, 2));

      const response = await apiClient.post<AuthResponse>('/register', data);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      toast.success('Registration successful! Please check your email to verify your account.');
      
      // Small delay before redirect
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 1500);
      
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Enhanced error logging
      if (error.response) {
        console.log('Error status:', error.response.status);
        console.log('Error data:', error.response.data);
        console.log('Error headers:', error.response.headers);
        
        // Handle 422 validation errors specifically
        if (error.response.status === 422) {
          const errorData = error.response.data;
          
          // Check if it's a Laravel-style validation error
          if (errorData.errors) {
            // Display all validation errors
            const errorMessages = Object.entries(errorData.errors).map(([field, messages]) => {
              return `${field}: ${(messages as string[]).join(', ')}`;
            });
            
            // Show the first error in toast
            const firstErrorField = Object.keys(errorData.errors)[0];
            const firstErrorMessage = errorData.errors[firstErrorField][0];
            toast.error(firstErrorMessage);
            
            // Log all errors to console for debugging
            console.log('Validation errors:', errorMessages);
            
            // You could also set these in state to display in the form
            setAuthError(JSON.stringify(errorData.errors, null, 2));
          } else if (errorData.message) {
            toast.error(errorData.message);
          } else {
            toast.error('Validation failed. Please check your input.');
          }
        } else if (error.response.status === 409) {
          toast.error('Email already registered. Please use a different email or try logging in.');
        } else {
          toast.error(error.response.data?.message || 'Registration failed');
        }
      } else if (error.request) {
        console.log('No response received:', error.request);
        toast.error('No response from server. Please try again.');
      } else {
        console.log('Error message:', error.message);
        toast.error('An error occurred. Please try again.');
      }
      
      throw error;
    }
  };

  const logout = async () => {
    try {
      setAuthError(null);
      await apiClient.post('/logout');
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Still remove local data even if server logout fails
      toast.error('Logged out locally');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      router.push('/');
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setAuthError(null);
      const response = await apiClient.put('/profile', data);
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error: any) {
      console.error('Profile update error:', error);
      
      if (error.response?.status === 422) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const firstError = Object.values(errorData.errors)[0] as string[];
          toast.error(firstError[0]);
        } else {
          toast.error('Validation failed');
        }
      } else {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
      
      throw error;
    }
  };

  return {
    user,
    loading,
    authError,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };
}