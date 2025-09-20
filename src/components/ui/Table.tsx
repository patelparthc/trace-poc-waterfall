import { useState, useMemo } from 'react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aVal = (a as any)[sortColumn];
      const bVal = (b as any)[sortColumn];

      if (aVal === bVal) return 0;

      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={`table-container ${className}`} style={{
      border: '1px solid var(--border-primary)',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: 'var(--bg-primary)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        flex: 1,
        overflow: 'auto',
        maxHeight: '400px'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead style={{
            position: 'sticky',
            top: 0,
            backgroundColor: 'var(--bg-secondary)',
            zIndex: 10
          }}>
            <tr>
              {columns.map((column, index) => (
                <th key={column.key || `header-${index}`} style={{
                  padding: '8px 12px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  cursor: column.sortable ? 'pointer' : 'default',
                  userSelect: 'none',
                  borderBottom: '1px solid var(--border-primary)'
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
            {paginatedData.map((row, rowIndex) => {
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
                    borderBottom: rowIndex < paginatedData.length - 1 ? '1px solid var(--border-secondary)' : 'none',
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (onRowClick) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {columns.map((column, colIndex) => (
                    <td key={`${rowKey}-${column.key || colIndex}`} style={{
                      padding: '8px 12px',
                      fontSize: '14px',
                      color: 'var(--text-primary)'
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

      {sortedData.length > 0 && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-primary)',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} rows
          </div>

          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              gap: '4px',
              alignItems: 'center'
            }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  border: '1px solid var(--border-primary)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage <= 1 ? 0.5 : 1,
                  borderRadius: '4px'
                }}
              >
                ← Prev
              </button>

              <span style={{
                padding: '0 8px',
                fontSize: '11px',
                color: 'var(--text-secondary)'
              }}>
                {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  border: '1px solid var(--border-primary)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage >= totalPages ? 0.5 : 1,
                  borderRadius: '4px'
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
