import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CuentasService } from '../../data-access/cuentas.service';
import { AccountSummary, AccountType, AccountCurrency } from '../../models/cuentas.models';
import { AccountCard } from '../../components/account-card';

@Component({
  selector: 'app-accounts-page',
  standalone: true,
  imports: [FormsModule, RouterLink, AccountCard, DecimalPipe],
  templateUrl: './accounts-page.html',
  styleUrl: './accounts-page.scss'
})
export class AccountsPage {
  private readonly service = inject(CuentasService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly accounts = signal<AccountSummary[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly formError = signal('');
  clienteId = 1;
  tipo: AccountType = 'AHORRO';
  moneda: AccountCurrency = 'ARS';

  constructor() {
    this.route.queryParamMap.subscribe(params => {
      const value = Number(params.get('clienteId') ?? 1);
      this.clienteId = Number.isSafeInteger(value) && value > 0 ? value : 1;
      this.load();
    });
  }

  search(): void {
    if (!Number.isSafeInteger(this.clienteId) || this.clienteId <= 0) {
      this.error.set('Ingresá un número de cliente válido.');
      return;
    }
    void this.router.navigate(['/cuentas'], { queryParams: { clienteId: this.clienteId } });
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.service.listarCuentas(this.clienteId).subscribe({
      next: accounts => { this.accounts.set(accounts); this.loading.set(false); },
      error: () => { this.error.set('No se pudieron cargar las cuentas. Intentá nuevamente.'); this.loading.set(false); }
    });
  }

  open(): void {
    if (this.saving() || !Number.isSafeInteger(this.clienteId) || this.clienteId <= 0) {
      this.formError.set('Ingresá un número de cliente válido.');
      return;
    }
    this.saving.set(true);
    this.formError.set('');
    this.service.abrirCuenta({ clienteId: this.clienteId, tipo: this.tipo, moneda: this.moneda }).subscribe({
      next: account => {
        this.saving.set(false);
        this.accounts.update(accounts => [...accounts, account]);
        void this.router.navigate(['/cuentas', account.id]);
      },
      error: error => { this.saving.set(false); this.formError.set(error instanceof Error ? error.message : 'No se pudo abrir la cuenta. Verificá que el cliente esté activo.'); }
    });
  }
}
