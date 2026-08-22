const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api/v1';

export async function fetchFromBackend<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const url = `${BACKEND_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Backend Fetch Error [${endpoint}]:`, error);
    return {
      success: false,
      error: (error as Error).message || 'Failed to connect to backend server',
    };
  }
}
