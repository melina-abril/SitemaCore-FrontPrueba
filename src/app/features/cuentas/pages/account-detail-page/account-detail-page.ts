import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrentUser } from '../../../../core/session/current-user';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { PageHeader } from '../../../../shared/components/page-header';
import { CuentasService } from '../../data-access/cuentas.service';
import { AccountDetail } from '../../models/account.models';

@Component({
  selector: 'app-account-detail-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, EmptyState, ErrorAlert, LoadingState, PageHeader],
  templateUrl: './account-detail-page.html',
  styleUrl: './account-detail-page.scss'
})
export class AccountDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(CuentasService);
  private readonly destroyRef = inject(DestroyRef);
  readonly currentUser = inject(CurrentUser);
  readonly account = signal<AccountDetail | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const id = Number(params.get('id'));
      this.account.set(null);
      this.error.set('');
      if (!Number.isSafeInteger(id) || id <= 0) {
        this.loading.set(false);
        this.error.set('El número de cuenta no es válido.');
        return;
      }
      this.loading.set(true);
      this.service.obtenerCuenta(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: account => {
          this.account.set(account);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('No se pudo cargar el detalle de la cuenta.');
        }
      });
    });
  }
}
