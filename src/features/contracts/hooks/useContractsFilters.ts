'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  filterContracts,
  type DocumentFilterValue,
} from '@/features/contracts/lib/contracts-utils';
import type { DocumentFlatten } from '@/types/ui.types';

export type SortOrder = 'newest' | 'oldest';
export type DateRange = { end: string | null; start: string | null };

export function useContractsFilters(activeContracts: DocumentFlatten[]) {
  const [filter, setFilter] = useState<DocumentFilterValue>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [dateRange, setDateRange] = useState<DateRange>({
    end: null,
    start: null,
  });

  const filteredContracts = useMemo(() => {
    let result = filterContracts(activeContracts, filter, search);

    if (dateRange.start ?? dateRange.end) {
      result = result.filter((contract) => {
        const date = contract.start_date;
        if (dateRange.start && date < dateRange.start) return false;
        if (dateRange.end && date > dateRange.end) return false;
        return true;
      });
    }

    result = [...result].sort((a, b) => {
      const cmp = a.start_date.localeCompare(b.start_date);
      return sortOrder === 'newest' ? -cmp : cmp;
    });

    return result;
  }, [activeContracts, filter, search, sortOrder, dateRange]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredContracts.length / itemsPerPage),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedContracts = filteredContracts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const isEmpty = activeContracts.length === 0;

  const resetPagination = useCallback(() => setCurrentPage(1), []);

  const changeFilter = useCallback((value: DocumentFilterValue) => {
    setFilter(value);
    setCurrentPage(1);
  }, []);

  const changeSearch = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const changeItemsPerPage = useCallback((value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  }, []);

  const changePage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages],
  );

  const changeSortOrder = useCallback((value: SortOrder) => {
    setSortOrder(value);
    setCurrentPage(1);
  }, []);

  const changeDateRange = useCallback((range: DateRange) => {
    setDateRange(range);
    setCurrentPage(1);
  }, []);

  return {
    changeFilter,
    changeItemsPerPage,
    changePage,
    changeDateRange,
    changeSearch,
    changeSortOrder,
    dateRange,
    filter,
    filteredContracts,
    isEmpty,
    itemsPerPage,
    paginatedContracts,
    resetPagination,
    safeCurrentPage,
    search,
    sortOrder,
    startIndex,
    totalPages,
  };
}
