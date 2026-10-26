import { Component, OnInit, inject, signal } from '@angular/core';
import { CierreService } from '../../data-access/cierre.service';
import { CierreDto, EstadoCierre } from '../../models/cierre.models';

@Component({
  selector: 'app-cierre-page',
  standalone: true,
  templateUrl: './cierre-page.html',
  styleUrl: './cierre-page.scss'
})
export class CierrePage implements OnInit {
  private readonly service = inject(CierreService);
  readonly cierre = signal<CierreDto | null>(null);
  readonly historial = signal<CierreDto[]>([]);
  readonly loading = signal(true);
  readonly historyLoading = signal(true);
  readonly working = signal(false);
  readonly error = signal('');
  readonly historyError = signal('');
  readonly actionError = signal('');
  readonly notice = signal('');

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.historyLoading.set(true);
    this.error.set('');
    this.historyError.set('');
    this.service.obtenerCierreDiario().subscribe({
      next: cierre => { this.cierre.set(cierre); this.loading.set(false); },
      error: () => { this.error.set('No se pudo consultar el cierre diario.'); this.loading.set(false); }
    });
    this.service.listarCierres().subscribe({
      next: cierres => { this.historial.set(cierres); this.historyLoading.set(false); },
      error: () => { this.historyError.set('No se pudo consultar el historial de cierres.'); this.historyLoading.set(false); }
    });
  }

  execute(): void {
    if (this.working() || this.cierre()?.estado !== 'PENDIENTE') return;
    this.runAction('execute');
  }

  retry(): void {
    if (this.working() || this.cierre()?.estado !== 'CON_ERROR') return;
    this.runAction('retry');
  }

  private runAction(action: 'execute' | 'retry'): void {
    this.working.set(true);
    this.actionError.set('');
    this.notice.set('');
    const request = action === 'execute' ? this.service.ejecutarCierre() : this.service.reprocesarCierre();
    request.subscribe({
      next: cierre => {
        this.cierre.set(cierre);
        this.working.set(false);
        this.notice(cierre.estado === 'COMPLETADO' ? 'El cierre diario se completó correctamente.' : 'Se actualizó el estado del cierre.');
        this.refresh();
      },
      error: (error: unknown) => {
        this.working.set(false);
        this.actionError.set(error instanceof Error ? error.message : 'No se pudo procesar el cierre. El día permanece abierto para reprocesarlo.');
        this.refresh();
      }
    });
  }

  stateLabel(state: EstadoCierre): string {
    switch (state) {
      case 'PENDIENTE': return 'Pendiente';
      case 'EN_CURSO': return 'En curso';
      case 'COMPLETADO': return 'Completado';
      case 'CON_ERROR': return 'Con error';
    }
  }

  stateClass(state: EstadoCierre): string {
    switch (state) {
      case 'COMPLETADO': return 'ok';
      case 'CON_ERROR': return 'failed';
      default: return 'warn';
    }
  }

  formatAmount(value: number): string {
    return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  }

  balances(cierre: CierreDto): { currency: string; amount: number }[] {
    return Object.entries(cierre.saldosCierre).map(([currency, amount]) => ({ currency, amount }));
  }

  formatDate(value: string): string {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }
}
