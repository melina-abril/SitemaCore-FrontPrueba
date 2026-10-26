import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrentUser } from '../../../../core/session/current-user';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import type { LoadState } from '../../../../shared/models/load-state';
import { DaySummaryCard } from '../../components/day-summary-card';
import { QuickLinks } from '../../components/quick-links';
import { InicioService } from '../../data-access/inicio.service';
import type { ResumenDia } from '../../models/inicio.models';

@Component({
  selector: 'app-inicio-page',
  standalone: true,
  imports: [DaySummaryCard, QuickLinks, LoadingState, ErrorAlert],
  templateUrl: './inicio-page.html',
  styleUrl: './inicio-page.scss'
})
export class InicioPage implements OnInit {
  private readonly inicioService = inject(InicioService);
  private readonly destroyRef = inject(DestroyRef);
  public readonly currentUser = inject(CurrentUser);
  public readonly state = signal<LoadState<ResumenDia>>({ status: 'loading' });

  public ngOnInit(): void {
    this.loadSummary();
  }

  public loadSummary(): void {
    this.state.set({ status: 'loading' });
    this.inicioService.obtenerResumenDia()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: ResumenDia) => this.state.set({ status: 'ready', data }),
        error: () => this.state.set({ status: 'error', message: 'No se pudo cargar el resumen del día' })
      });
  }
}
