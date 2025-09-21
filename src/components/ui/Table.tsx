import { useState, useMemo } from 'react';
import type { TableColumn } from '../../types';

interface TableProps<T> {
  readonly data: T[];
  readonly columns: TableColumn<T>[];
  readonly onRowClick?: (item: T) => void;
  readonly className?: string;
  readonly maxRows?: number;
  readonly getRowKey?: (item: T, index: number) => string;
  readonly isAuroraEnabled?: boolean;
  readonly selectedRowKey?: string | null;
}

export default function Table<T>({
  data,
  columns,
  onRowClick,
  className = '',
  maxRows = 100,
  getRowKey = (_, index) => `row-${index}`,
  isAuroraEnabled = false,
  selectedRowKey
}: TableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
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
      borderRadius: '12px',
      overflow: 'hidden',
      backgroundColor: isAuroraEnabled ? 'rgba(0, 0, 0, 0.6)' : 'var(--bg-primary)',
      backdropFilter: isAuroraEnabled ? 'blur(20px)' : 'none',
      border: isAuroraEnabled ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid var(--border-primary)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      margin: isAuroraEnabled ? '8px' : '0'
    }}>
      <div style={{
        flex: 1,
        overflow: 'auto',
        minHeight: 0
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <thead style={{
            position: 'sticky',
            top: 0,
            backgroundColor: isAuroraEnabled ? 'rgba(0, 0, 0, 0.8)' : 'var(--bg-secondary)',
            backdropFilter: isAuroraEnabled ? 'blur(15px)' : 'none',
            zIndex: 10
          }}>
            <tr>
              {columns.map((column, index) => {
                const isFirstColumn = index === 0;
                const isLastColumn = index === columns.length - 1;

                return (
                  <th key={column.key || `header-${index}`} style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: isAuroraEnabled ? '#ffffff' : 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    cursor: column.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    borderBottom: isAuroraEnabled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--border-primary)',
                    ...(isFirstColumn && { borderTopLeftRadius: '12px' }),
                    ...(isLastColumn && { borderTopRightRadius: '12px' })
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
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => {
              const rowKey = getRowKey ? getRowKey(row, rowIndex) : rowIndex.toString();
              const isSelected = selectedRowKey && selectedRowKey === rowKey;

              return (
                <tr
                  key={rowKey}
                  onClick={() => onRowClick?.(row)}
                  onMouseEnter={() => setHoveredRow(rowKey)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    background: isSelected
                      ? isAuroraEnabled
                        ? 'rgba(37, 99, 235, 0.2)'
                        : '#eff6ff'
                      : hoveredRow === rowKey
                        ? isAuroraEnabled
                          ? 'rgba(255, 255, 255, 0.05)'
                          : '#f9fafb'
                        : 'transparent',
                    ...(isAuroraEnabled && (isSelected || hoveredRow === rowKey) ? {
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                    } : {}),
                    transition: 'all 0.2s ease',
                    cursor: onRowClick ? 'pointer' : 'default',
                  }}
                >
                  {columns.map((column, colIndex) => {
                    const isLastRow = rowIndex === paginatedData.length - 1;
                    const isFirstColumn = colIndex === 0;
                    const isLastColumn = colIndex === columns.length - 1;

                    return (
                      <td key={`${rowKey}-${column.key || colIndex}`} style={{
                        padding: '8px 12px',
                        fontSize: '14px',
                        color: isAuroraEnabled ? '#ffffff' : 'var(--text-primary)',
                        ...(isLastRow && isFirstColumn && { borderBottomLeftRadius: '12px' }),
                        ...(isLastRow && isLastColumn && { borderBottomRightRadius: '12px' })
                      }}>
                        {column.render ? column.render(row) : String((row as any)[column.key] || '')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedData.length > 0 && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: isAuroraEnabled ? 'rgba(0, 0, 0, 0.3)' : 'var(--bg-secondary)',
          backdropFilter: isAuroraEnabled ? 'blur(10px)' : 'none',
          borderTop: isAuroraEnabled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--border-primary)',
          fontSize: '12px',
          color: isAuroraEnabled ? '#ffffff' : 'var(--text-secondary)',
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
                  border: isAuroraEnabled ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid var(--border-primary)',
                  backgroundColor: isAuroraEnabled ? 'rgba(255, 255, 255, 0.1)' : 'var(--bg-primary)',
                  color: isAuroraEnabled ? '#ffffff' : 'var(--text-primary)',
                  cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage <= 1 ? 0.5 : 1,
                  borderRadius: '4px',
                  backdropFilter: isAuroraEnabled ? 'blur(10px)' : 'none'
                }}
              >
                ← Prev
              </button>

              <span style={{
                padding: '0 8px',
                fontSize: '11px',
                color: isAuroraEnabled ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-secondary)'
              }}>
                {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  border: isAuroraEnabled ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid var(--border-primary)',
                  backgroundColor: isAuroraEnabled ? 'rgba(255, 255, 255, 0.1)' : 'var(--bg-primary)',
                  color: isAuroraEnabled ? '#ffffff' : 'var(--text-primary)',
                  cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage >= totalPages ? 0.5 : 1,
                  borderRadius: '4px',
                  backdropFilter: isAuroraEnabled ? 'blur(10px)' : 'none'
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
