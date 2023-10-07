interface PaginationInfo {
  totalDocs: number;
  offset: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
type WithPagination<T> = T extends Array<infer U>
  ? {
      docs: U[];
    } & PaginationInfo
  : {
      docs: T;
    };
interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data?: WithPagination<T>;
}

export default ApiResponse;
