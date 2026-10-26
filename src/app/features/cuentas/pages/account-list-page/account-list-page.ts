import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AccountCard } from '../../components/account-card';
import { CuentasService } from '../../data-access/cuentas.service';
import { AccountCurrency, AccountSummary, AccountType } from '../../models/account.models';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { PageHeader } from '../../../../shared/components/page-header';

@Component({
  selector: 'app-account-list-page',
  standalone: true,
  imports: [FormsModule, RouterLink, AccountCard, EmptyState, ErrorAlert, LoadingState, PageHeader],
  templateUrl: './account-list-page.html',
  styleUrl: './account-list-page.scss'
})
export class AccountListPage {
  private readonly service = inject(CuentasService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  clientId = 101;
  newType: AccountType = 'AHORRO';
  newCurrency: AccountCurrency = 'ARS';
  readonly accounts = signal<AccountSummary[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly actionError = signal('');
  readonly notice = signal('');
  readonly saving = signal(false);

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const requestedId = Number(params.get('clienteId'));
      this.clientId = Number.isSafeInteger(requestedId) && requestedId > 0 ? requestedId : 101;
      this.load();
    });
  }

  load(): void {
    this.error.set('');
    this.accounts.set([]);
    if (!Number.isSafeInteger(this.clientId) || this.clientId <= 0) {
      this.loading.set(false);
      this.error.set('Ingresá un número de cliente válido.');
      return;
    }
    this.loading.set(true);
    this.service.listarCuentas(this.clientId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: accounts => {
        this.accounts.set(accounts);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No se pudieron cargar las cuentas. Intentá nuevamente.');
      }
    });
  }

  openAccount(): void {
    this.actionError.set('');
    this.notice.set('');
    if (!Number.isSafeInteger(this.clientId) || this.clientId <= 0) {
      this.actionError.set('Ingresá un número de cliente válido.');
      return;
    }
    this.saving.set(true);
    this.service.abrirCuenta({ clienteId: this.clientId, tipo: this.newType, moneda: this.newCurrency })
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: account => {
          this.saving.set(false);
          this.notice.set(`Se abrió la cuenta ${account.numero}.`);
          this.load();
        },
        error: (reason: unknown) => {
          this.saving.set(false);
          this.actionError.set(reason instanceof Error ? reason.message : 'No se pudo abrir la cuenta.');
        }
      });
  }
}
