"use client";

import { useMemo, useState } from "react";

export const TABLE_PAGINATION_PAGE_SIZE_OPTIONS = [5, 10, 15, 20] as const;
export const TABLE_PAGINATION_DEFAULT_PAGE_SIZE = 10;

export function useTablePagination<T>(items: T[], defaultPageSize = TABLE_PAGINATION_DEFAULT_PAGE_SIZE) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultPageSize);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;

  const paginatedItems = useMemo(
    () => items.slice(startIndex, startIndex + itemsPerPage),
    [items, startIndex, itemsPerPage],
  );

  const changePage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const changeItemsPerPage = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return {
    changePage,
    changeItemsPerPage,
    currentPage: safeCurrentPage,
    itemsPerPage,
    paginatedItems,
    startIndex,
    totalCount: items.length,
    totalPages,
  };
}