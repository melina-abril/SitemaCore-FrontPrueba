import { HttpErrorResponse } from '@angular/common/http';
import { LoginRequest, LoginResponse, Rol } from '../models/autenticacion.models';

interface MockUser {
  nombre: string;
  contrasena: string;
  rol: Rol;
  intentosFallidos: number;
}

interface AccessEvent {
  usuario: string;
  accion: 'INGRESO' | 'INTENTO_FALLIDO' | 'BLOQUEO' | 'CIERRE_SESION';
  fecha: string;
}

const users: Record<string, MockUser> = {
  operador: { nombre: 'Juan Martínez', contrasena: 'operador123', rol: 'OPERADOR', intentosFallidos: 0 },
  supervisor: { nombre: 'Laura Fernández', contrasena: 'supervisor123', rol: 'SUPERVISOR', intentosFallidos: 0 },
};

const events: AccessEvent[] = [];
let activeUser: string | null = null;

function record(usuario: string, accion: AccessEvent['accion']): void {
  events.push({ usuario, accion, fecha: new Date().toISOString() });
}

/** Simulación local: se reemplaza por el backend al desactivar useMock. */
export function mockLogin(request: LoginRequest): LoginResponse {
  const usuario = request.usuario.trim();
  const user = Object.hasOwn(users, usuario) ? users[usuario] : undefined;

  if (user && user.intentosFallidos >= 5) {
    throw new HttpErrorResponse({ status: 423, statusText: 'Usuario bloqueado' });
  }

  if (!user || user.contrasena !== request.contrasena) {
    if (user) {
      user.intentosFallidos += 1;
    }
    record(usuario, 'INTENTO_FALLIDO');
    if (user && user.intentosFallidos >= 5) {
      record(usuario, 'BLOQUEO');
      throw new HttpErrorResponse({ status: 423, statusText: 'Usuario bloqueado' });
    }
    throw new HttpErrorResponse({ status: 401, statusText: 'Credenciales incorrectas' });
  }

  user.intentosFallidos = 0;
  activeUser = usuario;
  record(usuario, 'INGRESO');
  return {
    token: `mock-session-${usuario}`,
    expiraEn: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    nombre: user.nombre,
    rol: user.rol,
  };
}

export function mockFailedAttempts(usuario: string): number | null {
  return Object.hasOwn(users, usuario) ? users[usuario].intentosFallidos : null;
}

export function mockLogout(): void {
  if (activeUser !== null) {
    record(activeUser, 'CIERRE_SESION');
    activeUser = null;
  }
}
