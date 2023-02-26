import { getPageTitle } from "./utils";

describe("getPageTitle", () => {
  it("return 2,3,4", () => {
    expect(getPageTitle({ activePage: 1, size: 5 })).toEqual([2, 3, 4]);
  });
  it("return 2,3,...", () => {
    expect(getPageTitle({ activePage: 2, size: 10 })).toEqual([
      2,
      3,
      "ellipsis_start",
    ]);
  });
  it("return ...8,9", () => {
    expect(getPageTitle({ activePage: 9, size: 10 })).toEqual([
      "ellipsis_end",
      8,
      9,
    ]);
  });
  it("return ...3,4,5...", () => {
    expect(getPageTitle({ activePage: 4, size: 10 })).toEqual([
      "ellipsis_start",
      3,
      4,
      5,
      "ellipsis_end",
    ]);
  });
  it("return ...,8,9", () => {
    expect(getPageTitle({ activePage: 10, size: 10 })).toEqual([
      "ellipsis_end",
      8,
      9,
    ]);
  });
  it("return ...,8,9 for page = size - PAGE_OFFSET", () => {
    expect(getPageTitle({ activePage: 7, size: 10 })).toEqual([
      "ellipsis_end",
      7,
      8,
      9,
    ]);
  });
  it("return 2,3... for first page", () => {
    expect(getPageTitle({ activePage: 1, size: 10 })).toEqual([
      2,
      3,
      "ellipsis_start",
    ]);
  });
  it("return 2,3... for page = PAGE_OFFSET", () => {
    expect(getPageTitle({ activePage: 3, size: 10 })).toEqual([
      2,
      3,
      4,
      "ellipsis_start",
    ]);
  });
});
