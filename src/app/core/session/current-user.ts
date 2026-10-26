import { Injectable, Signal, computed, signal } from '@angular/core';

export interface SessionUser {
  name: string;
  role: 'OPERADOR' | 'SUPERVISOR';
}

@Injectable({ providedIn: 'root' })
export class CurrentUser {
  readonly user: Signal<SessionUser> = signal<SessionUser>({
    name: 'María Fernández',
    role: 'SUPERVISOR'
  });

  readonly isSupervisor: Signal<boolean> = computed(() => this.user().role === 'SUPERVISOR');
}
