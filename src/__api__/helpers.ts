import { USER_KEY } from "../contexts/UserContext";

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

export type FetchType = <JSON = unknown>(input: RequestInfo, init?: RequestInit) => Promise<JSON | ErrorRequest>

export const fetchAPI: FetchType = async (input, init) => {
  const requestInfo: RequestInfo = typeof input === 'string' ? getURL(input) : { ...input, url: getURL(input.url) };
  const { headers, ...rest } = init || {};
  const response = await fetch(requestInfo, {
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
    const err = await response.json()
    return err as ErrorRequest;
  }
}

export const fetchWithToken: FetchType = async (input, init) => {
  const { token } = JSON.parse(localStorage.getItem(USER_KEY) || "{}") || {};
  const { headers, ...rest } = init || {};
  return fetchAPI(input, {
    headers: {
      "Authorization": `Bearer ${token}`,
      ...(headers || {})
    },
    ...(rest || {})
  })
}