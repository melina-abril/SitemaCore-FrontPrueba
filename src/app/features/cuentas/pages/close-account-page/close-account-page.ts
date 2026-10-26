import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CuentasService } from '../../data-access/cuentas.service';
import { AccountDetail } from '../../models/cuentas.models';

@Component({
  selector: 'app-close-account-page',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './close-account-page.html',
  styleUrl: './close-account-page.scss'
})
export class CloseAccountPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(CuentasService);
  readonly account = signal<AccountDetail | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  private readonly id = Number(this.route.snapshot.paramMap.get('id'));

  constructor() { this.load(); }

  load(): void {
    if (!Number.isSafeInteger(this.id) || this.id <= 0) {
      this.error.set('Número de cuenta inválido.'); this.loading.set(false); return;
    }
    this.loading.set(true);
    this.error.set('');
    this.service.obtenerCuenta(this.id).subscribe({
      next: account => { this.account.set(account); this.loading.set(false); },
      error: () => { this.error.set('No se pudo cargar la cuenta.'); this.loading.set(false); }
    });
  }

  close(): void {
    const account = this.account();
    if (!account || account.estado !== 'ACTIVA' || account.saldo !== 0 || this.saving()) return;
    this.saving.set(true);
    this.error.set('');
    this.service.cerrarCuenta(account.id).subscribe({
      next: () => { this.saving.set(false); void this.router.navigate(['/cuentas', account.id]); },
      error: error => { this.error.set(error instanceof Error ? error.message : 'No se pudo cerrar la cuenta.'); this.saving.set(false); }
    });
  }
}
