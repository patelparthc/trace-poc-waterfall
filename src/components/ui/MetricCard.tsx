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
  className = '',
  isAuroraEnabled = false
}: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`metric-card ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isAuroraEnabled ? 'rgba(0, 0, 0, 0.6)' : 'var(--bg-primary)',
        backdropFilter: isAuroraEnabled ? 'blur(20px)' : 'none',
        border: isAuroraEnabled ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid var(--border-primary)',
        borderRadius: '16px',
        padding: '24px',
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        margin: isAuroraEnabled ? '4px' : '0',
        position: 'relative',
        overflow: 'hidden'
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
          color: isAuroraEnabled ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {title}
        </div>
        {icon && (
          <div style={{
            color,
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: `${color}15`,
            flexShrink: 0
          }}>
            {icon}
          </div>
        )}
      </div>

      <div style={{
        fontSize: '28px',
        fontWeight: '700',
        color: isAuroraEnabled ? '#ffffff' : 'var(--text-primary)',
        marginBottom: '8px',
        lineHeight: 1,
        textShadow: isAuroraEnabled ? '0 2px 4px rgba(0, 0, 0, 0.5)' : 'none'
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
          color: isAuroraEnabled ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-secondary)',
          lineHeight: 1.4
        }}>
          {description}
        </div>
      )}
    </div>
  );
}