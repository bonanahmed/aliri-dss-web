import { PaginationProps } from "@/types/pagination";
import { ChangeEventHandler } from "react";

export type TableProps = {
  fields?: any[] | undefined;
  values: Array<any>;
  onItemsPerPageChange?: ChangeEventHandler<HTMLSelectElement> | undefined;
  actionOptions?: DropdownActionButtonProps[] | undefined;
  pagination?: PaginationProps;
  scopedSlots?: any;
  onPaginationNumberClick?: (currentNumber: number) => void;
  onSearch?: ChangeEventHandler<HTMLInputElement> | undefined;
};

type DropdownActionButtonProps = {
  label: string;
  action: (e: any) => void;
};
