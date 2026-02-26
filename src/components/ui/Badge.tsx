import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'sm' | 'md';
}

const variants = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  default: 'bg-gray-100 text-gray-800',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
};

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${variants[variant]}
        ${sizes[size]}
      `}
    >
      {children}
    </span>
  );
}

// Status Badge specific
export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { variant: 'default'|'success' | 'warning' | 'error' | 'info'; label: string }> = {
    verified: { variant: 'success', label: 'Verified' },
    approved: { variant: 'success', label: 'Approved' },
    pending: { variant: 'warning', label: 'Pending' },
    rejected: { variant: 'error', label: 'Rejected' },
    revoked: { variant: 'error', label: 'Revoked' },
    active: { variant: 'success', label: 'Active' },
    draft: { variant: 'default', label: 'Draft' },
    in_review: { variant: 'info', label: 'In Review' },
  };

  const { variant, label } = config[status] || { variant: 'default', label: status };

  return <Badge variant={variant}>{label}</Badge>;
}