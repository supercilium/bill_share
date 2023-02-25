interface Params {
  activePage: number;
  size: number;
}

const OFFSET_PAGES = 3;
const MAX_PAGES_WITHOUT_GROUPS = 5;

export const getPageTitle = ({ activePage, size }: Params) => {
  // return [2,3]
  if (size <= MAX_PAGES_WITHOUT_GROUPS) {
    return new Array(size - 2).fill(1).map((_, i) => i + 2);
  }
  // return [2,3...]
  if (activePage < OFFSET_PAGES) {
    return new Array(OFFSET_PAGES)
      .fill(1)
      .map((_, i) => (i + 2 <= OFFSET_PAGES ? i + 2 : "ellipsis_start"));
  }
  // return [2,3...]
  if (activePage === OFFSET_PAGES) {
    return new Array(OFFSET_PAGES + 1)
      .fill(1)
      .map((_, i) => (i + 2 <= OFFSET_PAGES + 1 ? i + 2 : "ellipsis_start"));
  }
  // return [...size-2, size-1]
  if (activePage > size - OFFSET_PAGES) {
    return new Array(OFFSET_PAGES)
      .fill(1)
      .map((_, i) => (i > 0 ? size - (OFFSET_PAGES - i) : "ellipsis_end"));
  }
  if (activePage === size - OFFSET_PAGES) {
    return new Array(OFFSET_PAGES + 1)
      .fill(1)
      .map((_, i) => (i > 0 ? size - (OFFSET_PAGES - i + 1) : "ellipsis_end"));
  }
  // return [...3,4,5...]
  if (activePage > OFFSET_PAGES && activePage < size - OFFSET_PAGES) {
    return new Array(OFFSET_PAGES + 2).fill(1).map((_, i) => {
      if (i === 0) {
        return "ellipsis_start";
      }
      if (i === OFFSET_PAGES + 1) {
        return "ellipsis_end";
      }
      if (i < Math.ceil(OFFSET_PAGES / 2)) {
        return activePage - 1;
      }
      if (i > Math.ceil(OFFSET_PAGES / 2)) {
        return activePage + 1;
      }

      return activePage;
    });
  }
  return [];
};
