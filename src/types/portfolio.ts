export interface PortfolioItem {
  id: number;
  portfolio_id: number;
  type: 'project' | 'certificate' | 'work_experience' | 'education' | 'assessment';
  title: string;
  description?: string;
  organization?: string;
  issue_date?: string;
  expiry_date?: string;
  credential_id?: string;
  file_path?: string;
  file_type?: string;
  file_size?: number;
  metadata?: any;
  status: 'draft' | 'pending' | 'verified' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export interface Verification {
  id: number;
  verification_number: string;
  portfolio_item_id: number;
  institution_id: number;
  verified_by?: number;
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'revoked';
  remarks?: string;
  rejection_reason?: string;
  verified_at?: string;
  verification_data?: any;
  created_at?: string;
  updated_at?: string;
}

export interface Badge {
  id: number;
  badge_id: string;
  user_id: number;
  issuer_id: number;
  verification_id?: number;
  name: string;
  skill_name: string;
  description?: string;
  badge_image?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  criteria?: any;
  issued_at: string;
  expires_at?: string;
  status: 'active' | 'expired' | 'revoked';
  revoke_reason?: string;
  created_at?: string;
  updated_at?: string;
}