export const setXSRF = () => {
  const csrfToken = document.cookie.replace(
    // eslint-disable-next-line no-useless-escape
    /(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  document
    .querySelector("meta[name='_csrf_header']")
    ?.setAttribute("content", csrfToken);
};
