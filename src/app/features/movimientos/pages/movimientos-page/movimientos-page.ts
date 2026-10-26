import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrentUser } from '../../../../core/session/current-user';
import { MovimientosService } from '../../data-access/movimientos.service';
import { ConsultaResponse, MovimientoFilters, MovimientoRequest, MovimientoResponse } from '../../models/movimientos.models';

@Component({
  selector: 'app-movimientos-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './movimientos-page.html',
  styleUrl: './movimientos-page.scss'
})
export class MovimientosPage implements OnInit {
  private readonly service = inject(MovimientosService);
  private readonly route = inject(ActivatedRoute);
  readonly session = inject(CurrentUser);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly notice = signal('');
  readonly result = signal<ConsultaResponse | null>(null);
  readonly editingId = signal<number | null>(null);
  filters: MovimientoFilters = {};
  form: MovimientoRequest = this.emptyForm();

  ngOnInit(): void {
    const account = this.route.snapshot.queryParamMap.get('cuentaId');
    if (account && Number.isInteger(Number(account)) && Number(account) > 0) {
      this.filters.cuentaId = Number(account);
      this.form.cuentaId = Number(account);
    }
    this.search();
  }

  private emptyForm(): MovimientoRequest {
    return { cuentaId: 0, tipo: 'CREDITO', importe: 0, fechaOperativa: new Date().toISOString().slice(0, 10), concepto: '' };
  }

  search(): void {
    this.error.set('');
    this.loading.set(true);
    const filters: MovimientoFilters = {
      ...(this.filters.cuentaId ? { cuentaId: Number(this.filters.cuentaId) } : {}),
      ...(this.filters.desde ? { desde: this.filters.desde } : {}),
      ...(this.filters.hasta ? { hasta: this.filters.hasta } : {})
    };
    if (filters.desde && filters.hasta && filters.desde > filters.hasta) {
      this.error.set('La fecha inicial no puede ser posterior a la final.');
      this.loading.set(false);
      return;
    }
    this.service.consultarMovimientos(filters).subscribe({
      next: response => { this.result.set(response); this.loading.set(false); },
      error: () => { this.error.set('No se pudieron consultar los movimientos. Intente nuevamente.'); this.loading.set(false); }
    });
  }

  edit(item: MovimientoResponse): void {
    if (item.cerrado) return;
    this.editingId.set(item.id);
    this.form = { cuentaId: item.cuentaId, tipo: item.tipo, importe: item.importe, fechaOperativa: item.fechaOperativa, concepto: item.concepto };
    this.error.set('');
    this.notice.set('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancel(): void {
    this.editingId.set(null);
    this.form = this.emptyForm();
  }

  save(): void {
    this.error.set('');
    this.notice.set('');
    const request: MovimientoRequest = { ...this.form, cuentaId: Number(this.form.cuentaId), importe: Number(this.form.importe), concepto: this.form.concepto.trim() };
    if (!Number.isInteger(request.cuentaId) || request.cuentaId <= 0 || !Number.isFinite(request.importe) || request.importe <= 0 || !request.concepto || !request.fechaOperativa) {
      this.error.set('Complete la cuenta, fecha, concepto y un importe mayor que cero.');
      return;
    }
    this.saving.set(true);
    const id = this.editingId();
    const operation = id === null ? this.service.registrarMovimiento(request) : this.service.modificarMovimiento(id, request);
    operation.subscribe({
      next: () => {
        this.saving.set(false);
        this.cancel();
        this.notice.set(id === null ? 'Movimiento registrado correctamente.' : 'Movimiento actualizado correctamente.');
        this.search();
      },
      error: error => { this.saving.set(false); this.error.set(error instanceof Error ? error.message : 'No se pudo guardar el movimiento.'); }
    });
  }

  remove(item: MovimientoResponse): void {
    if (item.cerrado || !window.confirm('¿Dar de baja este movimiento?')) return;
    this.error.set('');
    this.service.eliminarMovimiento(item.id).subscribe({
      next: () => { this.notice.set('Movimiento dado de baja.'); this.search(); },
      error: error => this.error.set(error instanceof Error ? error.message : 'No se pudo dar de baja el movimiento.')
    });
  }
}
