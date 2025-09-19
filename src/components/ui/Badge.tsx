import type { BadgeVariant } from '../../types';

interface BadgeProps {
  readonly children: React.ReactNode;
  readonly variant?: BadgeVariant;
  readonly size?: 'small' | 'medium' | 'large';
  readonly className?: string;
}

export default function Badge({
  children,
  variant = 'default',
  size = 'medium',
  className = ''
}: BadgeProps) {
  const variants: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
    success: { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
    error: { bg: '#fecaca', color: '#dc2626', border: '#fca5a5' },
    warning: { bg: '#fef3c7', color: '#d97706', border: '#fde68a' },
    info: { bg: '#dbeafe', color: '#2563eb', border: '#93c5fd' },
    default: { bg: '#f3f4f6', color: '#4b5563', border: '#d1d5db' }
  };

  const sizes = {
    small: { padding: '2px 6px', fontSize: '11px' },
    medium: { padding: '4px 8px', fontSize: '12px' },
    large: { padding: '6px 12px', fontSize: '14px' }
  };

  const style = variants[variant];
  const sizeStyle = sizes[size];

  return (
    <span 
      className={`badge ${className}`}
      style={{
        display: 'inline-block',
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        borderRadius: '4px',
        fontWeight: 500,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        verticalAlign: 'baseline',
        ...sizeStyle
      }}
    >
      {children}
    </span>
  );
}