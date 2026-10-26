import { Injectable, signal, type WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CurrentUser {
  public readonly user: WritableSignal<{ name: string; role: 'OPERADOR' | 'SUPERVISOR' }> = signal({
    name: 'Lucía Gómez',
    role: 'SUPERVISOR'
  });

  public setRole(role: 'OPERADOR' | 'SUPERVISOR'): void {
    this.user.update((current) => ({ ...current, role }));
  }
}
