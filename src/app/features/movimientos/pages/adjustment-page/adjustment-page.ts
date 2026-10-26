import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MovimientosService } from '../../data-access/movimientos.service';
import { AjusteRequest } from '../../models/movimientos.models';

@Component({
  selector: 'app-adjustment-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './adjustment-page.html',
  styleUrl: '../movimientos-page/movimientos-page.scss'
})
export class AdjustmentPage {
  private readonly service = inject(MovimientosService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly originalId = Number(this.route.snapshot.paramMap.get('id'));
  form: AjusteRequest = { direccion: 'CREDITO', importe: 0, concepto: '' };

  save(): void {
    this.error.set('');
    if (!Number.isInteger(this.originalId) || this.originalId <= 0 || !Number.isFinite(Number(this.form.importe)) || Number(this.form.importe) <= 0 || !this.form.concepto.trim()) {
      this.error.set('Complete un importe positivo y el concepto del ajuste.');
      return;
    }
    this.saving.set(true);
    this.service.ajustarMovimiento(this.originalId, { direccion: this.form.direccion, importe: Number(this.form.importe), concepto: this.form.concepto.trim() }).subscribe({
      next: () => { this.saving.set(false); void this.router.navigate(['/movimientos']); },
      error: error => { this.saving.set(false); this.error.set(error instanceof Error ? error.message : 'No se pudo registrar el ajuste.'); }
    });
  }
}
