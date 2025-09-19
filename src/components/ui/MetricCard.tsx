import { useState } from 'react';
import type { MetricCardProps } from '../../types';

export default function MetricCard({
  title,
  value,
  change,
  description,
  icon,
  color = '#3b82f6',
  onClick,
  className = ''
}: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`metric-card ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: isHovered ? '0 4px 16px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.08)',
        transform: isHovered ? 'translateY(-2px)' : 'none',
        transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default'
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {title}
        </div>
        {icon && (
          <div style={{ color, fontSize: '20px' }}>
            {icon}
          </div>
        )}
      </div>

      <div style={{
        fontSize: '28px',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: '8px',
        lineHeight: 1
      }}>
        {value}
      </div>

      {change && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          fontWeight: '500',
          color: change.isPositive ? '#059669' : '#dc2626',
          marginBottom: '8px'
        }}>
          <span>{change.trend === 'up' ? '↗' : '↘'}</span>
          <span>{Math.abs(change.value)}%</span>
        </div>
      )}

      {description && (
        <div style={{
          fontSize: '12px',
          color: '#6b7280',
          lineHeight: 1.4
        }}>
          {description}
        </div>
      )}
    </div>
  );
}