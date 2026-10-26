import { environment } from '../../../environments/environment';

/** Combina la base configurada y el path completo del contrato sin duplicar /api. */
export function apiUrl(path: string): string {
  const base = environment.apiBaseUrl.replace(/\/$/, '');
  const servicePath = path.startsWith('/') ? path : `/${path}`;
  if (base.endsWith('/api') && servicePath.startsWith('/api/')) {
    return `${base}${servicePath.slice(4)}`;
  }
  return `${base}${servicePath}`;
}
