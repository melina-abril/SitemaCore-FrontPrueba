import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CurrentUser } from '../../../../core/session/current-user';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { PageHeader } from '../../../../shared/components/page-header';
import { LoadState } from '../../../../shared/models/load-state';
import { MovimientosService } from '../../data-access/movimientos.service';
import { AjusteRequest, ConsultaMovimientosResponse, MovimientoRequest, MovimientoResponse, TipoMovimiento } from '../../models/movimientos.models';

@Component({
  selector: 'app-movimientos-page',
  standalone: true,
  imports: [FormsModule, RouterLink, EmptyState, ErrorAlert, LoadingState, PageHeader],
  templateUrl: './movimientos-page.html',
  styleUrl: './movimientos-page.scss'
})
export class MovimientosPage implements OnInit {
  private readonly service = inject(MovimientosService);
  private readonly route = inject(ActivatedRoute);
  readonly currentUser = inject(CurrentUser);
  readonly state = signal<LoadState<ConsultaMovimientosResponse>>({ status: 'loading' });
  readonly saving = signal(false);
  readonly actionError = signal('');
  readonly notice = signal('');
  readonly editingId = signal<number | null>(null);
  readonly adjustmentId = this.route.snapshot.paramMap.has('id') ? Number(this.route.snapshot.paramMap.get('id')) : null;

  filterCuentaId: number | null = null;
  filterDesde = '';
  filterHasta = '';
  form: MovimientoRequest = this.emptyForm();
  adjustment: AjusteRequest = { direccion: 'CREDITO', importe: 0, concepto: '' };

  ngOnInit(): void {
    this.load();
  }

  private emptyForm(): MovimientoRequest {
    return { cuentaId: 101, tipo: 'CREDITO', importe: 0, fechaOperativa: '2026-06-15', concepto: '' };
  }

  load(): void {
    this.actionError.set('');
    if (this.filterDesde && this.filterHasta && this.filterDesde > this.filterHasta) {
      this.state.set({ status: 'error', message: 'La fecha inicial no puede ser posterior a la final.' });
      return;
    }
    this.state.set({ status: 'loading' });
    this.service.consultarMovimientos({
      cuentaId: this.filterCuentaId === null ? undefined : Number(this.filterCuentaId),
      desde: this.filterDesde || undefined,
      hasta: this.filterHasta || undefined
    }).subscribe({
      next: data => this.state.set(data.movimientos.length ? { status: 'ready', data } : { status: 'empty' }),
      error: () => this.state.set({ status: 'error', message: 'No se pudieron cargar los movimientos. Intente nuevamente.' })
    });
  }

  edit(movement: MovimientoResponse): void {
    if (movement.cerrado || movement.tipo === 'AJUSTE') return;
    this.editingId.set(movement.id);
    this.form = { cuentaId: movement.cuentaId, tipo: movement.tipo, importe: movement.importe, fechaOperativa: movement.fechaOperativa, concepto: movement.concepto };
    this.actionError.set('');
    this.notice.set('');
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form = this.emptyForm();
  }

  save(): void {
    if (this.saving()) return;
    this.actionError.set('');
    this.notice.set('');
    if (!Number.isInteger(Number(this.form.cuentaId)) || Number(this.form.cuentaId) <= 0 || !Number.isFinite(Number(this.form.importe)) || Number(this.form.importe) <= 0 || !this.form.fechaOperativa || !this.form.concepto.trim()) {
      this.actionError.set('Complete la cuenta, la fecha, el concepto y un importe mayor que cero.');
      return;
    }
    const request: MovimientoRequest = { ...this.form, cuentaId: Number(this.form.cuentaId), importe: Number(this.form.importe) };
    const id = this.editingId();
    this.saving.set(true);
    const operation = id === null ? this.service.registrarMovimiento(request) : this.service.modificarMovimiento(id, request);
    this.complete(operation, id === null ? 'Movimiento registrado.' : 'Movimiento actualizado.', () => this.cancelEdit());
  }

  remove(movement: MovimientoResponse): void {
    if (movement.cerrado || this.saving() || !window.confirm(`¿Dar de baja el movimiento ${movement.id}?`)) return;
    this.saving.set(true);
    this.actionError.set('');
    this.notice.set('');
    this.service.eliminarMovimiento(movement.id).subscribe({
      next: () => { this.saving.set(false); this.cancelEdit(); this.notice.set('Movimiento dado de baja.'); this.load(); },
      error: (error: unknown) => { this.saving.set(false); this.actionError.set(this.errorMessage(error)); }
    });
  }

  saveAdjustment(): void {
    if (this.adjustmentId === null || !Number.isInteger(this.adjustmentId) || this.adjustmentId <= 0 || !this.currentUser.isSupervisor() || this.saving()) return;
    this.actionError.set('');
    this.notice.set('');
    if (!Number.isFinite(Number(this.adjustment.importe)) || Number(this.adjustment.importe) <= 0 || !this.adjustment.concepto.trim()) {
      this.actionError.set('Indique un importe mayor que cero y el concepto del ajuste.');
      return;
    }
    this.saving.set(true);
    this.complete(this.service.ajustarMovimiento(this.adjustmentId, { ...this.adjustment, importe: Number(this.adjustment.importe) }), 'Ajuste registrado sin modificar el movimiento original.', () => {
      this.adjustment = { direccion: 'CREDITO', importe: 0, concepto: '' };
    });
  }

  private complete(operation: Observable<MovimientoResponse>, message: string, reset: () => void): void {
    operation.subscribe({
      next: () => { this.saving.set(false); reset(); this.notice.set(message); this.load(); },
      error: (error: unknown) => { this.saving.set(false); this.actionError.set(this.errorMessage(error)); }
    });
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error && error.message ? error.message : 'No se pudo completar la operación. Intente nuevamente.';
  }
}
