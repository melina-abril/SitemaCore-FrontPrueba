import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { PageHeader } from '../../../../shared/components/page-header';
import { LoadingState } from '../../../../shared/components/loading-state';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { ClosingTotals } from '../../components/closing-totals';
import { CierreService } from '../../data-access/cierre.service';
import { CierreDto, EstadoCierre } from '../../models/cierre.models';

@Component({
  selector: 'app-cierre-page',
  standalone: true,
  imports: [DatePipe, DecimalPipe, PageHeader, LoadingState, EmptyState, ErrorAlert, ClosingTotals],
  templateUrl: './cierre-page.html',
  styleUrl: './cierre-page.scss'
})
export class CierrePage implements OnInit {
  private readonly service = inject(CierreService);
  readonly current = signal<CierreDto | null>(null);
  readonly history = signal<CierreDto[]>([]);
  readonly loading = signal(true);
  readonly historyLoading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly historyError = signal('');
  readonly actionError = signal('');

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.historyLoading.set(true);
    this.error.set('');
    this.historyError.set('');
    this.service.obtenerCierreDiario().subscribe({
      next: data => { this.current.set(data); this.loading.set(false); },
      error: () => { this.error.set('No se pudo cargar el cierre diario. Inténtelo nuevamente.'); this.loading.set(false); }
    });
    this.service.listarCierres().subscribe({
      next: data => { this.history.set(data); this.historyLoading.set(false); },
      error: () => { this.historyError.set('No se pudo cargar el historial de cierres.'); this.historyLoading.set(false); }
    });
  }

  run(reprocess: boolean): void {
    if (this.saving() || (reprocess ? this.current()?.estado !== 'CON_ERROR' : this.current()?.estado !== 'PENDIENTE')) {
      return;
    }
    this.saving.set(true);
    this.actionError.set('');
    const request = reprocess ? this.service.reprocesarCierre() : this.service.ejecutarCierre();
    request.subscribe({
      next: data => { this.current.set(data); this.saving.set(false); this.refresh(); },
      error: () => {
        this.actionError.set('No se pudo completar el cierre. El día permanece abierto; revise el motivo e inténtelo nuevamente.');
        this.saving.set(false);
        this.refresh();
      }
    });
  }

  statusLabel(status: EstadoCierre): string {
    switch (status) {
      case 'PENDIENTE': return 'Pendiente';
      case 'EN_CURSO': return 'En curso';
      case 'COMPLETADO': return 'Completado';
      case 'CON_ERROR': return 'Con error';
    }
  }
}
