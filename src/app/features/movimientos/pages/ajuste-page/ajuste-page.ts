import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { LoadState } from '../../../../shared/models/load-state';
import { MovimientosService } from '../../data-access/movimientos.service';
import { AjusteRequest, MovimientoResponse } from '../../models/movimientos.models';

@Component({
  selector: 'app-ajuste-page',
  standalone: true,
  imports: [FormsModule, RouterLink, ErrorAlert, LoadingState],
  templateUrl: './ajuste-page.html',
  styleUrl: './ajuste-page.scss'
})
export class AjustePage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(MovimientosService);
  private readonly destroyRef = inject(DestroyRef);
  public readonly state = signal<LoadState<MovimientoResponse>>({ status: 'loading' });
  public readonly saving = signal(false);
  public readonly errorMessage = signal('');
  public readonly id = Number(this.route.snapshot.paramMap.get('id'));
  public form: AjusteRequest = { direccion: 'CREDITO', importe: 0, concepto: '' };

  public constructor() {
    if (!Number.isSafeInteger(this.id) || this.id <= 0) {
      this.state.set({ status: 'error', message: 'El identificador del movimiento no es válido.' });
      return;
    }
    this.service.consultarMovimientos({}).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        const original = result.movimientos.find((item) => item.id === this.id);
        this.state.set(original?.cerrado ? { status: 'ready', data: original } : { status: 'error', message: 'No se encontró un movimiento cerrado con ese identificador.' });
      },
      error: (error: unknown) => this.state.set({ status: 'error', message: error instanceof Error ? error.message : 'No se pudo consultar el movimiento.' })
    });
  }

  public submit(): void {
    this.errorMessage.set('');
    if (!Number.isFinite(this.form.importe) || this.form.importe <= 0 || !this.form.concepto.trim()) {
      this.errorMessage.set('Ingresá un importe mayor que cero y un concepto.');
      return;
    }
    this.saving.set(true);
    this.service.ajustarMovimiento(this.id, { ...this.form }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { void this.router.navigate(['/movimientos']); },
      error: (error: unknown) => {
        this.saving.set(false);
        this.errorMessage.set(error instanceof Error ? error.message : 'No se pudo registrar el ajuste.');
      }
    });
  }
}
