export function getURL(path: RequestInfo) {
  return `${process.env.REACT_APP_API_URL || "http://localhost:3001"
    }${path}`;
}

export interface ErrorRequest {
  error: string;
  message: string;
  statusCode: number;
}

export type FetchType = <JSON = unknown>(input: RequestInfo, init?: RequestInit) => Promise<JSON | ErrorRequest>

// Helper to make GET requests to Strapi
export const fetchAPI: FetchType = async (input, init) => {
  const requestInfo: RequestInfo = typeof input === 'string' ? getURL(input) : { ...input, url: getURL(input.url) };
  const response = await fetch(requestInfo, {
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
      ...init?.headers
    },
    ...init
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    console.log(response.status)
    const err = await response.json()
    return err as ErrorRequest;
  }
}
