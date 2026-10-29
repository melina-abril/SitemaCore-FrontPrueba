import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CurrentUser } from '../../../../core/session/current-user';
import { LoadState } from '../../../../shared/models/load-state';
import { DaySummaryCard } from '../../components/day-summary-card';
import { QuickLinks } from '../../components/quick-links';
import { InicioService } from '../../data-access/inicio.service';
import { ResumenDia } from '../../models/inicio.models';

@Component({
  selector: 'app-inicio-page',
  imports: [DaySummaryCard, QuickLinks],
  templateUrl: './inicio-page.html',
  styleUrl: './inicio-page.scss',
})
export class InicioPage {
  private readonly inicioService = inject(InicioService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly session = inject(CurrentUser);
  protected readonly state = signal<LoadState<ResumenDia>>({ status: 'loading' });
  protected readonly nombre = computed(() => {
    const current = this.state();
    return current.status === 'ready' ? current.data.nombre : (this.session.nombre() ?? 'Personal operativo');
  });
  protected readonly rol = computed(() => {
    const current = this.state();
    const role = current.status === 'ready' ? current.data.rol : this.session.rol();
    return role === 'SUPERVISOR' ? 'Supervisora o supervisor' : 'Operadora u operador';
  });
  protected readonly iniciales = computed(() => this.nombre()
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join(''));

  constructor() {
    this.load();
  }

  /** La consulta se repite cada vez que se entra a esta pantalla, sin usar un resumen anterior. */
  protected load(): void {
    this.state.set({ status: 'loading' });
    this.inicioService.getDailySummary()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.state.set({ status: 'ready', data }),
        error: () => this.state.set({ status: 'error', message: 'No se pudo cargar el resumen del día' }),
      });
  }
}
