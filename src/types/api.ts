/**
 * Common API Response wrapper
 * All backend responses should follow this structure.
 */
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    timestamp: string;
    requestId: string;
}

/**
 * Common Pagination Metadata
 */
export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

/**
 * Paginated Response Wrapper
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    meta: PaginationMeta;
}

/**
 * Base DTO interface to enforce structure
 */
export interface BaseDTO {
    id: string;
    createdAt?: string;
    updatedAt?: string;
}

// Example usage documentation
/*
export interface UserDTO extends BaseDTO {
    email: string;
    fullName: string;
}

export type UserResponse = ApiResponse<UserDTO>;
*/
