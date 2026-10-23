import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { MovimientosService } from '../../data-access/movimientos.service';
import { AdjustmentRequest, MovementResponse } from '../../models/movimientos.models';

@Component({
  selector: 'app-adjustment-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './adjustment-page.html',
  styleUrl: './adjustment-page.scss'
})
export class AdjustmentPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(MovimientosService);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly original = signal<MovementResponse | null>(null);
  readonly adjustment = signal<MovementResponse | null>(null);
  form: AdjustmentRequest = { direccion: 'CREDITO', importe: 0, concepto: '' };

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isSafeInteger(id) || id <= 0) { this.error.set('Identificador de movimiento inválido.'); this.loading.set(false); return; }
    this.service.searchMovements().pipe(finalize(() => this.loading.set(false))).subscribe({
      next: result => {
        const movement = result.movimientos.find(item => item.id === id && item.cerrado);
        if (movement) this.original.set(movement);
        else this.error.set('No se encontró un movimiento cerrado con ese identificador.');
      },
      error: () => this.error.set('No se pudo consultar el movimiento original.')
    });
  }

  save(): void {
    const original = this.original();
    if (!original || this.saving() || this.adjustment()) return;
    if (!Number.isFinite(this.form.importe) || this.form.importe <= 0 || !this.form.concepto.trim()) {
      this.error.set('Ingrese un importe mayor que cero y un concepto.'); return;
    }
    this.saving.set(true);
    this.error.set('');
    this.service.createAdjustment(original.id, { ...this.form, concepto: this.form.concepto.trim() }).pipe(finalize(() => this.saving.set(false))).subscribe({
      next: result => this.adjustment.set(result),
      error: (error: unknown) => this.error.set(error instanceof Error ? error.message : 'No se pudo registrar el ajuste.')
    });
  }
}
