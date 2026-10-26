import { DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrentUser } from '../../../../core/session/current-user';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import type { LoadState } from '../../../../shared/models/load-state';
import { ClosingSummary } from '../../components/closing-summary';
import { CierreService } from '../../data-access/cierre.service';
import type { ClosingStatus, DailyClosing } from '../../models/cierre.models';

@Component({
  selector: 'app-cierre-page',
  standalone: true,
  imports: [DecimalPipe, EmptyState, ErrorAlert, LoadingState, ClosingSummary],
  templateUrl: './cierre-page.html',
  styleUrl: './cierre-page.scss'
})
export class CierrePage implements OnInit {
  private readonly service = inject(CierreService);
  private readonly destroyRef = inject(DestroyRef);
  public readonly currentUser = inject(CurrentUser);
  public readonly closingState = signal<LoadState<DailyClosing>>({ status: 'loading' });
  public readonly historyState = signal<LoadState<DailyClosing[]>>({ status: 'loading' });
  public readonly submitting = signal(false);
  public readonly actionError = signal<string | null>(null);

  public ngOnInit(): void {
    this.loadClosing();
    this.loadHistory();
  }

  public loadClosing(): void {
    this.closingState.set({ status: 'loading' });
    this.service.getDailyClosing().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (closing) => this.closingState.set({ status: 'ready', data: closing }),
      error: () => this.closingState.set({ status: 'error', message: 'No se pudo consultar el cierre diario.' })
    });
  }

  public loadHistory(): void {
    this.historyState.set({ status: 'loading' });
    this.service.listClosings().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (history) => this.historyState.set(history.length ? { status: 'ready', data: history } : { status: 'empty' }),
      error: () => this.historyState.set({ status: 'error', message: 'No se pudo consultar el historial de cierres.' })
    });
  }

  public execute(): void {
    const state = this.closingState();
    if (this.currentUser.user().role !== 'SUPERVISOR' || this.submitting() || state.status !== 'ready' || state.data.estado !== 'PENDIENTE') return;
    this.submit(false);
  }

  public retry(): void {
    const state = this.closingState();
    if (this.currentUser.user().role !== 'SUPERVISOR' || this.submitting() || state.status !== 'ready' || state.data.estado !== 'CON_ERROR') return;
    this.submit(true);
  }

  public statusLabel(status: ClosingStatus): string {
    switch (status) {
      case 'PENDIENTE': return 'Pendiente';
      case 'EN_CURSO': return 'En curso';
      case 'COMPLETADO': return 'Completado';
      case 'CON_ERROR': return 'Con error';
    }
  }

  private submit(isRetry: boolean): void {
    this.actionError.set(null);
    this.submitting.set(true);
    const request = isRetry ? this.service.retryClosing() : this.service.executeClosing();
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (closing) => {
        this.closingState.set({ status: 'ready', data: closing });
        this.submitting.set(false);
        this.loadHistory();
      },
      error: () => {
        this.submitting.set(false);
        this.actionError.set('No se pudo completar el cierre. Consulte el motivo y vuelva a intentarlo.');
        this.loadClosing();
      }
    });
  }
}
