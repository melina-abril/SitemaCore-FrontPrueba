import { CurrentUser } from '../session/current-user';

export interface SessionView {
  name: string;
  role: string;
  isSupervisor: boolean;
}

// Adapta la señal de sesión para el encabezado y la navegación sin duplicar estado de usuario.
export function sessionView(session: CurrentUser): SessionView {
  const source: unknown = session;
  if (typeof source !== 'object' || source === null) {
    return { name: 'Usuario operativo', role: 'OPERADOR', isSupervisor: false };
  }
  const record = source as Record<string, unknown>;
  const candidate = record['user'] ?? record['currentUser'] ?? record['usuario'];
  const user: unknown = typeof candidate === 'function' ? (candidate as () => unknown)() : candidate;
  const details: Record<string, unknown> = typeof user === 'object' && user !== null
    ? user as Record<string, unknown>
    : record;
  const roleValue = details['role'] ?? details['rol'];
  const nameValue = details['name'] ?? details['nombre'];
  const role = typeof roleValue === 'string' ? roleValue : 'OPERADOR';
  return {
    name: typeof nameValue === 'string' ? nameValue : 'Usuario operativo',
    role,
    isSupervisor: role === 'SUPERVISOR'
  };
}
