import { CurrentUser } from '../session/current-user';

export interface SessionView {
  name: string;
  role: string;
  isSupervisor: boolean;
}

function unwrap(value: unknown): unknown {
  if (typeof value === 'function') {
    return (value as () => unknown)();
  }
  return value;
}

function record(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null
    ? value as Record<string, unknown>
    : {};
}

// Adapta únicamente la presentación del servicio de sesión existente.
export function readSessionView(currentUser: CurrentUser): SessionView {
  const service = record(currentUser);
  const user = record(unwrap(service['user'] ?? service['currentUser'] ?? service['usuario'] ?? service['session']));
  const rawName = unwrap(user['name'] ?? user['nombre'] ?? user['displayName'] ?? service['name']);
  const rawRole = unwrap(user['role'] ?? user['rol'] ?? service['role'] ?? service['rol']);
  const name = typeof rawName === 'string' && rawName.trim() ? rawName : 'Usuario operativo';
  const role = typeof rawRole === 'string' ? rawRole.toUpperCase() : 'OPERADOR';
  const supervisor = unwrap(service['isSupervisor']);
  return { name, role, isSupervisor: supervisor === true || role === 'SUPERVISOR' };
}
