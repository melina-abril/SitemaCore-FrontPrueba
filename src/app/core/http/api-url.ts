import { environment } from '../../../environments/environment';

/** Une la URL base con rutas contractuales que pueden incluir /api. */
export function apiUrl(path: string): string {
  const base = environment.apiBaseUrl.replace(/\/+$/, '');
  const requested = `/${path.replace(/^\/+/, '')}`;
  const normalized = base.endsWith('/api') && (requested === '/api' || requested.startsWith('/api/'))
    ? requested.slice(4)
    : requested;
  return `${base}${normalized}`;
}
