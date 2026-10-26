import { environment } from '../../../environments/environment';

export function apiUrl(path: string): string {
  const base = environment.apiBaseUrl.replace(/\/+$/, '');
  const servicePath = `/${path.replace(/^\/+/, '')}`;

  if (!base) {
    return servicePath;
  }

  if (base.endsWith('/api') && (servicePath === '/api' || servicePath.startsWith('/api/'))) {
    return `${base}${servicePath.slice('/api'.length)}`;
  }

  return `${base}${servicePath}`;
}
