import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Rol } from './role';

export interface UserSession {
  token: string;
  usuario: string;
  nombre: string;
  rol: Rol;
}

interface StoredSession extends UserSession {
  lastActivity: number;
}

const STORAGE_KEY = 'sistema-core-session';
const INACTIVITY_MS = 30 * 60 * 1000;

function readSession(): StoredSession | null {
  if (typeof sessionStorage === 'undefined') {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const value: unknown = JSON.parse(raw);
    if (typeof value !== 'object' || value === null) {
      return null;
    }

    const session = value as Partial<StoredSession>;
    if (
      typeof session.token !== 'string' ||
      typeof session.usuario !== 'string' ||
      typeof session.nombre !== 'string' ||
      (session.rol !== 'OPERADOR' && session.rol !== 'SUPERVISOR') ||
      typeof session.lastActivity !== 'number' ||
      !Number.isFinite(session.lastActivity) ||
      Date.now() - session.lastActivity >= INACTIVITY_MS
    ) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return session as StoredSession;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class CurrentUser {
  private readonly router = inject(Router);
  private readonly initialSession = readSession();
  private lastActivity = this.initialSession?.lastActivity ?? 0;
  private expiryTimer: ReturnType<typeof setTimeout> | undefined;

  readonly token = signal<string | null>(this.initialSession?.token ?? null);
  readonly usuario = signal<string | null>(this.initialSession?.usuario ?? null);
  readonly nombre = signal<string | null>(this.initialSession?.nombre ?? null);
  readonly rol = signal<Rol | null>(this.initialSession?.rol ?? null);
  readonly isLoggedIn = computed(() => this.token() !== null);
  readonly isSupervisor = computed(() => this.rol() === 'SUPERVISOR');

  constructor() {
    if (this.initialSession) {
      this.scheduleExpiry();
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('pointerdown', () => this.recordActivity());
      window.addEventListener('keydown', () => this.recordActivity());
    }
  }

  start(session: UserSession): void {
    this.token.set(session.token);
    this.usuario.set(session.usuario);
    this.nombre.set(session.nombre);
    this.rol.set(session.rol);
    this.recordActivity();
  }

  updateToken(token: string): void {
    if (!this.isLoggedIn() || !token) {
      return;
    }
    this.token.set(token);
    this.recordActivity();
  }

  clear(): void {
    if (this.expiryTimer !== undefined) {
      clearTimeout(this.expiryTimer);
      this.expiryTimer = undefined;
    }
    this.token.set(null);
    this.usuario.set(null);
    this.nombre.set(null);
    this.rol.set(null);
    this.lastActivity = 0;
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  private recordActivity(): void {
    if (!this.isLoggedIn()) {
      return;
    }
    this.lastActivity = Date.now();
    this.persist();
    this.scheduleExpiry();
  }

  private persist(): void {
    if (typeof sessionStorage === 'undefined') {
      return;
    }
    const token = this.token();
    const usuario = this.usuario();
    const nombre = this.nombre();
    const rol = this.rol();
    if (token !== null && usuario !== null && nombre !== null && rol !== null) {
      const session: StoredSession = { token, usuario, nombre, rol, lastActivity: this.lastActivity };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  }

  private scheduleExpiry(): void {
    if (this.expiryTimer !== undefined) {
      clearTimeout(this.expiryTimer);
    }
    const remaining = Math.max(0, INACTIVITY_MS - (Date.now() - this.lastActivity));
    this.expiryTimer = setTimeout(() => {
      if (Date.now() - this.lastActivity >= INACTIVITY_MS) {
        this.clear();
        void this.router.navigate(['/login'], { queryParams: { expired: 'true' } });
      } else {
        this.scheduleExpiry();
      }
    }, remaining);
  }
}
