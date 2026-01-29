import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export interface Column<T = any> {
    field: string;
    headerName: string;
    width?: number;
    flex?: number;
    sortable?: boolean;
    renderCell?: (row: T) => React.ReactNode;
}

export interface EiDataGridProps<T = any> {
    columns: Column<T>[];
    rows: T[];
    title?: string;
    height?: number | string;
    pageSize?: number;
    pageSizeOptions?: number[];
    loading?: boolean;
    className?: string;
    getRowId?: (row: T) => string | number;
}

export const EiDataGrid = <T extends Record<string, any>>({
    columns,
    rows,
    title,
    height = 400,
    pageSize: initialPageSize = 10,
    pageSizeOptions = [5, 10, 25, 50],
    loading = false,
    className,
    getRowId = (row) => row.id,
}: EiDataGridProps<T>) => {
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(initialPageSize);

    // Sorting logic
    const sortedRows = React.useMemo(() => {
        if (!sortField) return rows;

        return [...rows].sort((a, b) => {
            const aVal = a[sortField];
            const bVal = b[sortField];

            if (aVal === bVal) return 0;
            if (aVal === null || aVal === undefined) return 1;
            if (bVal === null || bVal === undefined) return -1;

            const comparison = aVal < bVal ? -1 : 1;
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [rows, sortField, sortDirection]);

    // Pagination logic
    const totalPages = Math.ceil(sortedRows.length / pageSize);
    const paginatedRows = sortedRows.slice(
        currentPage * pageSize,
        (currentPage + 1) * pageSize
    );

    const handleSort = (field: string, sortable?: boolean) => {
        if (!sortable) return;

        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(Math.max(0, Math.min(newPage, totalPages - 1)));
    };

    return (
        <div className={twMerge(clsx('bg-theme-bg-secondary rounded-xl border border-theme-border shadow-soft overflow-hidden', className))}>
            {title && (
                <div className="px-6 py-4 border-b border-theme-border">
                    <h3 className="text-lg font-semibold text-theme-text-primary">{title}</h3>
                </div>
            )}

            <div style={{ height }} className="overflow-auto">
                <table className="w-full">
                    <thead className="bg-theme-bg-tertiary sticky top-0 z-10">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.field}
                                    className={clsx(
                                        'px-6 py-3 text-left text-xs font-semibold text-theme-text-secondary uppercase tracking-wider border-b border-theme-border',
                                        column.sortable && 'cursor-pointer hover:bg-theme-bg-primary transition-colors'
                                    )}
                                    style={{ width: column.width, flex: column.flex }}
                                    onClick={() => handleSort(column.field, column.sortable)}
                                >
                                    <div className="flex items-center gap-2">
                                        {column.headerName}
                                        {column.sortable && sortField === column.field && (
                                            sortDirection === 'asc' ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-theme-border">
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="spinner w-8 h-8" />
                                        <p className="text-sm text-theme-text-secondary">Loading...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : paginatedRows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-theme-text-secondary">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            paginatedRows.map((row) => (
                                <tr
                                    key={getRowId(row)}
                                    className="hover:bg-theme-bg-tertiary transition-colors"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.field}
                                            className="px-6 py-4 text-sm text-theme-text-primary"
                                            style={{ width: column.width, flex: column.flex }}
                                        >
                                            {column.renderCell ? column.renderCell(row) : row[column.field]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-theme-border flex items-center justify-between bg-theme-bg-tertiary">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-theme-text-secondary">Rows per page:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(0);
                        }}
                        className="px-3 py-1 border border-theme-border rounded-lg bg-theme-bg-secondary text-sm text-theme-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-theme-text-secondary">
                        {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, rows.length)} of {rows.length}
                    </span>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => handlePageChange(0)}
                            disabled={currentPage === 0}
                            className="p-1 rounded hover:bg-theme-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronsLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="p-1 rounded hover:bg-theme-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1}
                            className="p-1 rounded hover:bg-theme-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => handlePageChange(totalPages - 1)}
                            disabled={currentPage >= totalPages - 1}
                            className="p-1 rounded hover:bg-theme-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronsRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
