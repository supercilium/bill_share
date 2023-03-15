export function getURL(path: RequestInfo) {
  return `${process.env.REACT_APP_API_URL || "http://localhost:3001"}${path}`;
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
) => Promise<JSON>;

export const fetchAPI: FetchType = async (input, init) => {
  const requestInfo: RequestInfo =
    typeof input === "string"
      ? getURL(input)
      : { ...input, url: getURL(input.url) };
  const { headers, ...rest } = init || {};
  const response = await fetch(requestInfo, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    ...(rest || {}),
  });
  try {
    if (response.ok) {
      if (response.status === 204) {
        return;
      }
      const data = await response.json();
      return data;
    } else {
      if (response.status === 401) {
        return Promise.reject<ErrorRequest>({
          status: 401,
        });
      }
      const error = await response.json();
      return Promise.reject<ErrorRequest>(error);
    }
  } catch (err) {
    return Promise.reject<ErrorRequest>(err);
  }
};
