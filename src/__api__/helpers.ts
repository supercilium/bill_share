export function getURL(path: RequestInfo) {
  return `${process.env.REACT_APP_API_URL || "http://localhost:3001"
    }${path}`;
}

export interface ErrorRequest {
  error: number;
  message: string;
  reason: string;
  status: string;
  timestamp: string;
}

export type FetchType = <JSON = unknown>(input: RequestInfo, init?: RequestInit) => Promise<JSON>

export const fetchAPI: FetchType = async (input, init) => {
  const requestInfo: RequestInfo = typeof input === 'string' ? getURL(input) : { ...input, url: getURL(input.url) };
  const { headers, ...rest } = init || {};
  const response = await fetch(requestInfo, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(headers || {})
    },
    ...(rest || {})
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    const err = await response.text()
    throw new Error(err || 'Network error');
  }
}

export const fetchWithToken: FetchType = async (input, init) => {
  const { headers, ...rest } = init || {};
  return fetchAPI(input, {
    headers: {
      ...(headers || {})
    },
    ...(rest || {})
  })
}