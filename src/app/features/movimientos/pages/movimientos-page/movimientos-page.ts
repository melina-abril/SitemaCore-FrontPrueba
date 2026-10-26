import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { CurrentUser } from '../../../../core/session/current-user';
import { MovementList } from '../../components/movement-list';
import { MovimientosService } from '../../data-access/movimientos.service';
import { MovementFilters, MovementRequest, MovementResponse, MovementSearchResponse } from '../../models/movimientos.models';

@Component({
  selector: 'app-movimientos-page',
  standalone: true,
  imports: [FormsModule, MovementList],
  templateUrl: './movimientos-page.html',
  styleUrl: './movimientos-page.scss'
})
export class MovimientosPage implements OnInit {
  private readonly service = inject(MovimientosService);
  private readonly router = inject(Router);
  readonly session = inject(CurrentUser);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly notice = signal('');
  readonly result = signal<MovementSearchResponse | null>(null);
  readonly editingId = signal<number | null>(null);
  filters = { cuentaId: '', desde: '', hasta: '' };
  form: MovementRequest = this.emptyForm();

  ngOnInit(): void { this.search(); }

  private emptyForm(): MovementRequest {
    return { cuentaId: 101, tipo: 'CREDITO', importe: 0, fechaOperativa: '2026-04-14', concepto: '' };
  }

  search(): void {
    const account = this.filters.cuentaId.trim();
    if (account && (!Number.isSafeInteger(Number(account)) || Number(account) <= 0)) {
      this.error.set('Ingrese un número de cuenta válido.');
      return;
    }
    if (this.filters.desde && this.filters.hasta && this.filters.desde > this.filters.hasta) {
      this.error.set('La fecha desde debe ser anterior o igual a la fecha hasta.');
      return;
    }
    const filters: MovementFilters = { ...(account ? { cuentaId: Number(account) } : {}), ...(this.filters.desde ? { desde: this.filters.desde } : {}), ...(this.filters.hasta ? { hasta: this.filters.hasta } : {}) };
    this.loading.set(true);
    this.error.set('');
    this.service.searchMovements(filters).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: result => this.result.set(result),
      error: () => this.error.set('No se pudieron consultar los movimientos. Intente nuevamente.')
    });
  }

  save(): void {
    if (this.saving()) return;
    const request = { ...this.form, concepto: this.form.concepto.trim() };
    if (!Number.isSafeInteger(request.cuentaId) || request.cuentaId <= 0 || !Number.isFinite(request.importe) || request.importe <= 0 || !request.concepto || !request.fechaOperativa) {
      this.error.set('Complete una cuenta válida, fecha, concepto e importe mayor que cero.');
      return;
    }
    const id = this.editingId();
    this.saving.set(true);
    this.error.set('');
    const operation = id === null ? this.service.createMovement(request) : this.service.updateOpenMovement(id, request);
    operation.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => { this.notice.set(id === null ? 'Movimiento registrado.' : 'Movimiento actualizado.'); this.cancelEdit(); this.search(); },
      error: (error: unknown) => this.error.set(error instanceof Error ? error.message : 'No se pudo guardar el movimiento.')
    });
  }

  beginEdit(movement: MovementResponse): void {
    if (movement.cerrado || movement.tipo === 'AJUSTE') return;
    this.editingId.set(movement.id);
    this.form = { cuentaId: movement.cuentaId, tipo: movement.tipo, importe: movement.importe, fechaOperativa: movement.fechaOperativa, concepto: movement.concepto };
    this.notice.set('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void { this.editingId.set(null); this.form = this.emptyForm(); }

  remove(movement: MovementResponse): void {
    if (movement.cerrado || !window.confirm(`¿Dar de baja el movimiento #${movement.id}?`)) return;
    this.error.set('');
    this.service.deleteOpenMovement(movement.id).subscribe({
      next: () => { if (this.editingId() === movement.id) this.cancelEdit(); this.notice.set('Movimiento dado de baja.'); this.search(); },
      error: (error: unknown) => this.error.set(error instanceof Error ? error.message : 'No se pudo dar de baja el movimiento.')
    });
  }

  openAdjustment(movement: MovementResponse): void {
    if (this.session.user().role === 'SUPERVISOR' && movement.cerrado) void this.router.navigate(['/movimientos/ajustes', movement.id]);
  }
}
