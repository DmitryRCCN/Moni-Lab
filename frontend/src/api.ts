const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: any;
}

let accessToken: string | null = null;
export function setAccessToken(token: string | null) {
  accessToken = token;
}
export function getAccessToken() {
  return accessToken;
}

async function fetchWithOpts(url: string, opts: ApiOptions) {
  const res = await fetch(url, opts);
  return res;
}

// Intenta renovar el access token usando la cookie HttpOnly (refreshToken)
export async function refreshAccessTokenViaCookie() {
  const url = `${API_BASE}/auth/refresh`;
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  const body = await res.json();
  if (body?.accessToken) {
    setAccessToken(body.accessToken);
    return body.accessToken as string;
  }
  throw new Error('No access token in refresh response');
}

export async function api(path: string, options: ApiOptions = {}) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_BASE}${normalizedPath}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (accessToken && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const opts: RequestInit = {
    ...options,
    // evitar caché para que el servidor no responda 304 Not Modified
    cache: (options as any).cache ?? 'no-store',
    credentials: 'include',
    headers,
  };

  if (opts.body && typeof opts.body !== 'string') {
    opts.body = JSON.stringify(opts.body);
  }

  let res = await fetchWithOpts(url, opts);

  // Si recibimos 401, intentar renovar usando cookie y reintentar una vez
  if (res.status === 401) {
    try {
      await refreshAccessTokenViaCookie();

      // reconstruir headers con nuevo token
      if (accessToken) {
        (opts.headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
      }
      res = await fetchWithOpts(url, opts);
    } catch (err) {
      // no se pudo refrescar, propagar error original
    }
  }

  if (!res.ok) {
    const text = await res.text();
    // intentar parsear JSON de error
    try {
      const json = JSON.parse(text || '{}');
      throw new Error(json.error || text || res.statusText);
    } catch (_) {
      throw new Error(text || res.statusText);
    }
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

export default api;
