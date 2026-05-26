export interface ApiResponse<T> {
  response: T;
}

export interface PaginatedData<T> {
  data: T[];
  total: number;
  recordsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;
