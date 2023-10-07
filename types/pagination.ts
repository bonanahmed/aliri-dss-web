export type PaginationProps = {
  totalDocs: number;
  offset?: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  prevPage?: any;
  nextPage?: any;
  onNumberClick?: (numberData: number) => void;
};
