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
      "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI5Y2JiNWM5LWVmMWMtNDA2Yi05Njc2LWIwY2U1NTE2MDYzMyIsIm5hbWUiOiJQb3BvZXNobmljayJ9.t_tNhAcjTYuFVEiFTaPKn0ZfEJToBs9xbmrQoXtq2yI",
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
