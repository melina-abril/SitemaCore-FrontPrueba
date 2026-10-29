import { environment } from '../../../environments/environment';

export function apiUrl(path: string): string {
  const base = environment.apiBaseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (!base) {
    return normalizedPath;
  }

  const basePath = base.startsWith('http://') || base.startsWith('https://')
    ? new URL(base).pathname.replace(/\/$/, '')
    : base;
  const relativePath = basePath && normalizedPath.startsWith(`${basePath}/`)
    ? normalizedPath.slice(basePath.length)
    : normalizedPath;
  return `${base}${relativePath}`;
}
