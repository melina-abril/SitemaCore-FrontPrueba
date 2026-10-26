import { environment } from '../../../environments/environment';

export function apiUrl(path: string): string {
  const base = environment.apiBaseUrl.replace(/\/+$/, '');
  const absolutePath = path.startsWith('/') ? path : `/${path}`;
  if (base.endsWith('/api') && (absolutePath === '/api' || absolutePath.startsWith('/api/'))) {
    return `${base}${absolutePath.slice(4)}`;
  }
  return `${base}${absolutePath}`;
}
