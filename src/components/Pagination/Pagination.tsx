import { FC } from "react";
import { getPageTitle } from "./utils";
import "./Pagination.scss";

interface PaginationProps {
  onChangePage: (page: number) => void;
  activePage: number;
  size: number;
}

export const Pagination: FC<PaginationProps> = ({
  activePage,
  size,
  onChangePage,
}) => {
  const pages = getPageTitle({
    activePage,
    size,
  });

  return (
    <nav
      className="pagination is-small"
      role="navigation"
      aria-label="pagination"
    >
      <button
        className="pagination-previous is-flex-grow-0"
        disabled={activePage === 1}
        onClick={() => onChangePage(activePage - 1)}
      >
        Previous
      </button>
      <button
        className="pagination-next is-flex-grow-0"
        onClick={() => onChangePage(activePage + 1)}
        disabled={activePage === size}
      >
        Next
      </button>
      <ul className="pagination-list is-flex-wrap-nowrap">
        <li>
          <button
            onClick={() => onChangePage(1)}
            className={`pagination-link${
              activePage === 1 ? " is-current" : ""
            }`}
            aria-label="Goto page 1"
            aria-current={activePage === 1 ? "page" : undefined}
          >
            1
          </button>
        </li>
        {pages.map((page) =>
          typeof page === "number" ? (
            <li key={page}>
              <button
                className={`pagination-link${
                  activePage === page ? " is-current" : ""
                }`}
                aria-label={`Goto page ${page}`}
                onClick={() => onChangePage(page)}
                aria-current={activePage === page ? "page" : undefined}
              >
                {page}
              </button>
            </li>
          ) : (
            <li key={page}>
              <span className="pagination-ellipsis">&hellip;</span>
            </li>
          )
        )}
        <li>
          <button
            className={`pagination-link${
              activePage === size ? " is-current" : ""
            }`}
            aria-label={`Goto page ${size}`}
            aria-current={activePage === size ? "page" : undefined}
            onClick={() => onChangePage(size)}
          >
            {size}
          </button>
        </li>
      </ul>
    </nav>
  );
};
