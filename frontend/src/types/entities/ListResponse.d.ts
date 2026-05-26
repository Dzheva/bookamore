export type ListResponse<T> = {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  number: number;
  numberOfElements: number;
  pageable: Pageable;
  sort: Sort;
};

type Pageable = {
  offset: number;
  pageNumber: number;
  pageSize: number;
  pages: boolean;
  sort: Sort;
};

type Sort = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};
