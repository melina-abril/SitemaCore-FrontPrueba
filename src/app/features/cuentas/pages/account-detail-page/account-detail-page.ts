import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CuentasService } from '../../data-access/cuentas.service';
import { AccountDetail } from '../../models/cuentas.models';
import { CurrentUserService } from '../../../../core/session/current-user';

@Component({
  selector: 'app-account-detail-page',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './account-detail-page.html',
  styleUrl: './account-detail-page.scss'
})
export class AccountDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(CuentasService);
  readonly currentUser = inject(CurrentUserService);
  readonly account = signal<AccountDetail | null>(null);
  readonly loading = signal(true);
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
}
