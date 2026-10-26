import { computed, Injectable, signal } from '@angular/core';

export type UserRole = 'OPERADOR' | 'SUPERVISOR';
export interface SessionUser { name: string; role: UserRole; }

@Injectable({ providedIn: 'root' })
export class CurrentUser {
  // Sesión de demostración; reemplazar por la identidad autenticada al conectar el backend.
  readonly user = signal<SessionUser>({ name: 'María López', role: 'SUPERVISOR' });
  readonly role = computed(() => this.user().role);
  readonly isSupervisor = computed(() => this.role() === 'SUPERVISOR');

  setRole(role: UserRole): void {
    if (role !== 'OPERADOR' && role !== 'SUPERVISOR') return;
    this.user.update(user => ({ ...user, role }));
  }
}
