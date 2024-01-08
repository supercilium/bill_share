export function getURL(path: RequestInfo) {
  return `${process.env.REACT_APP_API_URL ?? "http://localhost:3001"}${path}`;
}

export interface ErrorRequest {
  error: number;
  message: string;
  reason: string;
  status: number;
  timestamp: string;
  validation?: Record<string, string>;
}

export type FetchType = <JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit
) => Promise<JSON & { status?: number }>;

export const getCSRFToken = () => {
  const token = document
    .querySelector("meta[name='_csrf_header']")
    ?.getAttribute("content");

  return token;
};

const CSRF_TOKEN_HEADERS = ["POST", "PATCH", "DELETE", "PUT"];

export const fetchAPI: FetchType = async (input, init) => {
  const requestInfo: RequestInfo =
    typeof input === "string"
      ? getURL(input)
      : { ...input, url: getURL(input.url) };

  const { headers: inputHeaders, ...rest } = init || {};
  const headers: HeadersInit = new Headers({
    ...{ "Content-Type": "application/json" },
    ...inputHeaders,
  });
  const token = getCSRFToken();
  if (token && CSRF_TOKEN_HEADERS.includes(init?.method || "")) {
    headers.set("X-XSRF-TOKEN", token);
  }
  const response = await fetch(requestInfo, {
    credentials: "include",
    headers,
    ...(rest || {}),
  });
  try {
    if (response.ok) {
      if (response.status === 204) {
        return;
      }
      const data = await response.json();
      return { status: response.status, ...data };
    } else {
      if (response.status === 401) {
        return Promise.reject<ErrorRequest>({
          status: 401,
        });
      }
      try {
        const error = await response.json();
        return Promise.reject<ErrorRequest>(error);
      } catch (err) {
        return Promise.reject<ErrorRequest>({
          status: response.status,
          message: "Something went wrong, please try again later",
        });
      }
    }
  } catch (err) {
    return Promise.reject<ErrorRequest>(err);
  }
};
