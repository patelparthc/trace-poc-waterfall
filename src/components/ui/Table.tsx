import { useState } from 'react';
import type { TableColumn } from '../../types';

interface TableProps<T> {
  readonly data: T[];
  readonly columns: TableColumn<T>[];
  readonly onRowClick?: (item: T) => void;
  readonly className?: string;
  readonly maxRows?: number;
  readonly getRowKey?: (item: T, index: number) => string;
}

export default function Table<T>({
  data,
  columns,
  onRowClick,
  className = '',
  maxRows = 100,
  getRowKey = (_, index) => `row-${index}`
}: TableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  return (
    <div className={`table-container ${className}`} style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: 'white'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead style={{
            backgroundColor: '#f9fafb',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <tr>
              {columns.map((column, index) => (
                <th key={column.key || `header-${index}`} style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  cursor: column.sortable ? 'pointer' : 'default',
                  userSelect: 'none'
                }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  {column.header}
                  {sortColumn === column.key && (
                    <span style={{ marginLeft: '4px' }}>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, maxRows).map((row, rowIndex) => {
              const rowKey = getRowKey(row, rowIndex);
              return (
                <tr
                  key={rowKey}
                  onClick={() => onRowClick?.(row)}
                  onKeyDown={(e) => {
                    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onRowClick(row);
                    }
                  }}
                  tabIndex={onRowClick ? 0 : undefined}
                  style={{
                    borderBottom: '1px solid #f3f4f6',
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (onRowClick) {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {columns.map((column, colIndex) => (
                    <td key={`${rowKey}-${column.key || colIndex}`} style={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      {column.render ? column.render(row) : String((row as any)[column.key] || '')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data.length > maxRows && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#f9fafb',
          borderTop: '1px solid #e5e7eb',
          fontSize: '14px',
          color: '#6b7280',
          textAlign: 'center'
        }}>
          Showing {maxRows} of {data.length} rows
        </div>
      )}
    </div>
  );
}