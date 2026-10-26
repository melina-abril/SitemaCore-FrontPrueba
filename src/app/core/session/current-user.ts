import { computed, Injectable, signal } from '@angular/core';

export type UserRole = 'OPERADOR' | 'SUPERVISOR';
export interface CurrentUser { name: string; role: UserRole; }

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  readonly user = signal<CurrentUser>({ name: 'María González', role: 'OPERADOR' });
  readonly isSupervisor = computed(() => this.user().role === 'SUPERVISOR');

  setRole(role: UserRole): void {
    // Usuario de demostración; reemplazar con la sesión autenticada.
    this.user.set(role === 'SUPERVISOR'
      ? { name: 'Carlos Ruiz', role }
      : { name: 'María González', role });
  }
}
