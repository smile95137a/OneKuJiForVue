import { ref, computed } from 'vue';

export function usePagination(items: any, itemsPerPage: number) {
  const currentPage = ref(1);

  const totalPages = computed(() =>
    Math.ceil(items.value.length / itemsPerPage)
  );

  const currentPageItems = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    return items.value.slice(startIndex, startIndex + itemsPerPage);
  });

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const previousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value -= 1;
    }
  };

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value += 1;
    }
  };

  const renderPaginationNums = computed(() => {
    const maxVisiblePages = 5;
    const total = totalPages.value;
    const current = currentPage.value;

    const pages = [];
    const half = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, current - half);
    let endPage = Math.min(total, current + half);

    // 調整範圍，如果不足5個
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(total, startPage + maxVisiblePages - 1);
      } else if (endPage === total) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  });

  const updateItems = (newItems: any[]) => {
    currentPage.value = 1; // 更新資料時重置到第一頁
    items.value = newItems;
  };

  return {
    currentPage: computed(() => currentPage.value),
    totalPages: computed(() => totalPages.value),
    currentPageItems,
    goToPage,
    previousPage,
    nextPage,
    renderPaginationNums,
    updateItems,
  };
}
