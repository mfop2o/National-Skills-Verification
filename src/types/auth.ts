export type UserRole = 'user' | 'institution' | 'employer' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'pending';
  region?: string;
  city?: string;
  woreda?: string;
  kebele?: string;
  languages?: string[];
  
  // Institution specific
  institution_name?: string;
  institution_type?: string;
  is_verified_institution?: boolean;
  
  // Employer specific
  company_name?: string;
  is_verified_employer?: boolean;
  
  portfolio?: Portfolio;
  institution?: Institution;
  created_at?: string;
  updated_at?: string;
}

export interface Portfolio {
  id: number;
  user_id: number;
  title?: string;
  bio?: string;
  profile_photo?: string;
  cover_photo?: string;
  visibility: 'public' | 'private' | 'verified_only';
  views_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface Institution {
  id: number;
  user_id: number;
  institution_name: string;
  type: string;
  accreditation_number: string;
  approval_status: 'pending' | 'approved' | 'suspended' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  login: string;
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  role: UserRole;
  region?: string;
  city?: string;
  
  // Institution fields
  institution_name?: string;
  institution_type?: string;
  accreditation_number?: string;
  contact_person?: string;
  
  // Employer fields
  company_name?: string;
  company_registration?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}