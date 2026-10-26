import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrentUser } from '../../../../core/session/current-user';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { LoadState } from '../../../../shared/models/load-state';
import { MovimientosService } from '../../data-access/movimientos.service';
import { ConsultaMovimientosResponse, MovimientoFilters, MovimientoRequest, MovimientoResponse } from '../../models/movimientos.models';

@Component({
  selector: 'app-movimientos-page',
  standalone: true,
  imports: [FormsModule, RouterLink, EmptyState, ErrorAlert, LoadingState],
  templateUrl: './movimientos-page.html',
  styleUrl: './movimientos-page.scss'
})
export class MovimientosPage {
  private readonly service = inject(MovimientosService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  public readonly currentUser = inject(CurrentUser);
  public readonly state = signal<LoadState<ConsultaMovimientosResponse>>({ status: 'loading' });
  public readonly saving = signal(false);
  public readonly actionError = signal('');
  public readonly notice = signal('');
  public readonly editingId = signal<number | null>(null);
  public filterAccount = this.route.snapshot.queryParamMap.get('cuentaId') ?? '';
  public filterFrom = '';
  public filterTo = '';
  public form: MovimientoRequest = this.blankForm();

  public constructor() {
    this.load();
  }

  public load(): void {
    this.actionError.set('');
    if (this.filterFrom && this.filterTo && this.filterFrom > this.filterTo) {
      this.state.set({ status: 'error', message: 'La fecha inicial no puede ser posterior a la fecha final.' });
      return;
    }
    const filters: MovimientoFilters = {};
    if (this.filterAccount.trim()) {
      const id = Number(this.filterAccount);
      if (!Number.isSafeInteger(id) || id <= 0) {
        this.state.set({ status: 'error', message: 'Ingresá un número de cuenta válido.' });
        return;
      }
      filters.cuentaId = id;
    }
    if (this.filterFrom) filters.desde = this.filterFrom;
    if (this.filterTo) filters.hasta = this.filterTo;
    this.state.set({ status: 'loading' });
    this.service.consultarMovimientos(filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => this.state.set(data.movimientos.length ? { status: 'ready', data } : { status: 'empty' }),
      error: (error: unknown) => this.state.set({ status: 'error', message: this.errorMessage(error) })
    });
  }

  public save(): void {
    this.actionError.set('');
    this.notice.set('');
    if (!Number.isSafeInteger(this.form.cuentaId) || this.form.cuentaId <= 0 || !Number.isFinite(this.form.importe) || this.form.importe <= 0 || !this.form.concepto.trim() || !this.form.fechaOperativa) {
      this.actionError.set('Completá la cuenta, fecha, concepto e importe mayor que cero.');
      return;
    }
    const id = this.editingId();
    this.saving.set(true);
    const request = { ...this.form };
    const result = id === null ? this.service.registrarMovimiento(request) : this.service.modificarMovimiento(id, request);
    result.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving.set(false);
        this.notice.set(id === null ? 'Movimiento registrado correctamente.' : 'Movimiento actualizado correctamente.');
        this.cancelEdit();
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.actionError.set(this.errorMessage(error));
      }
    });
  }

  public edit(item: MovimientoResponse): void {
    if (item.cerrado || item.tipo === 'AJUSTE') return;
    this.editingId.set(item.id);
    this.form = { cuentaId: item.cuentaId, tipo: item.tipo, importe: item.importe, fechaOperativa: item.fechaOperativa, concepto: item.concepto };
    this.actionError.set('');
  }

  public cancelEdit(): void {
    this.editingId.set(null);
    this.form = this.blankForm();
  }

  public remove(item: MovimientoResponse): void {
    if (item.cerrado || !window.confirm(`¿Eliminar el movimiento ${item.id}?`)) return;
    this.saving.set(true);
    this.actionError.set('');
    this.service.eliminarMovimiento(item.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving.set(false);
        this.notice.set('Movimiento eliminado correctamente.');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.actionError.set(this.errorMessage(error));
      }
    });
  }

  public money(value: number): string {
    return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  }

  private blankForm(): MovimientoRequest {
    return { cuentaId: 1001, tipo: 'CREDITO', importe: 0, fechaOperativa: new Date().toISOString().slice(0, 10), concepto: '' };
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'No se pudo completar la operación. Intentá nuevamente.';
  }
}
