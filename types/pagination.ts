export type PaginationProps = {
  currentPage: number;
  totalPage: number;
  totalData: number;
  perPage: number;
  onNumberClick?: (numberData: number) => void;
};
