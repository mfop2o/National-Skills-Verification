import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import toast from 'react-hot-toast';

// Generic GET hook
export function useGet<T>(key: string[], url: string, options = {}) {
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      const response = await apiClient.get(url);
      return response.data;
    },
    ...options,
  });
}

// Generic POST hook
export function usePost<T, V>(url: string, options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: V) => {
      const response = await apiClient.post<T>(url, data);
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'An error occurred');
    },
    ...options,
  });
}

// Generic PUT hook
export function usePut<T, V>(url: string, options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: V) => {
      const response = await apiClient.put<T>(url, data);
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'An error occurred');
    },
    ...options,
  });
}

// Generic DELETE hook
export function useDelete(url: string, options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      const response = await apiClient.delete(`${url}/${id}`);
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'An error occurred');
    },
    ...options,
  });
}