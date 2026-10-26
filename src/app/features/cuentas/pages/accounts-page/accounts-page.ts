import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import type { LoadState } from '../../../../shared/models/load-state';
import { CuentasService } from '../../data-access/cuentas.service';
import type { AccountCurrency, AccountSummary, AccountType } from '../../models/cuentas.models';

@Component({
  selector: 'app-accounts-page',
  standalone: true,
  imports: [DecimalPipe, FormsModule, RouterLink, EmptyState, ErrorAlert, LoadingState],
  templateUrl: './accounts-page.html',
  styleUrl: './accounts-page.scss'
})
export class AccountsPage {
  private readonly service = inject(CuentasService);
  private readonly route = inject(ActivatedRoute);
  public readonly state = signal<LoadState<AccountSummary[]>>({ status: 'loading' });
  public readonly saving = signal(false);
  public readonly formError = signal('');
  public readonly notice = signal('');
  public clienteId = 101;
  public tipo: AccountType = 'AHORRO';
  public moneda: AccountCurrency = 'ARS';

  public constructor() {
    const requestedId = Number(this.route.snapshot.queryParamMap.get('clienteId'));
    if (Number.isSafeInteger(requestedId) && requestedId > 0) this.clienteId = requestedId;
    this.load();
  }

  public load(): void {
    this.notice.set('');
    if (!Number.isSafeInteger(this.clienteId) || this.clienteId <= 0) {
      this.state.set({ status: 'error', message: 'Ingrese un número de cliente válido.' });
      return;
    }
    this.state.set({ status: 'loading' });
    this.service.listarCuentas(this.clienteId).subscribe({
      next: (accounts) => this.state.set(accounts.length ? { status: 'ready', data: accounts } : { status: 'empty' }),
      error: () => this.state.set({ status: 'error', message: 'No se pudieron cargar las cuentas. Intente nuevamente.' })
    });
  }

  public open(): void {
    this.formError.set('');
    this.notice.set('');
    if (!Number.isSafeInteger(this.clienteId) || this.clienteId <= 0) {
      this.formError.set('Ingrese un número de cliente válido.');
      return;
    }
    this.saving.set(true);
    this.service.abrirCuenta({ clienteId: this.clienteId, tipo: this.tipo, moneda: this.moneda }).subscribe({
      next: () => {
        this.saving.set(false);
        this.load();
        this.notice.set('Cuenta abierta correctamente.');
      },
      error: (error: Error) => {
        this.saving.set(false);
        this.formError.set(error.message || 'No se pudo abrir la cuenta. Verifique que el cliente esté activo.');
      }
    });
  }
}
