import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { PageHeader } from '../../../../shared/components/page-header';
import { CuentasService } from '../../data-access/cuentas.service';
import { AccountDetail } from '../../models/account.models';

@Component({
  selector: 'app-account-close-page',
  standalone: true,
  imports: [RouterLink, ErrorAlert, LoadingState, PageHeader],
  templateUrl: './account-close-page.html',
  styleUrl: './account-close-page.scss'
})
export class AccountClosePage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(CuentasService);
  private readonly destroyRef = inject(DestroyRef);
  readonly account = signal<AccountDetail | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isSafeInteger(id) || id <= 0) {
      this.loading.set(false);
      this.error.set('El número de cuenta no es válido.');
      return;
    }
    this.service.obtenerCuenta(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: account => {
        this.account.set(account);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No se pudo consultar la cuenta.');
      }
    });
  }

  confirmClose(): void {
    const account = this.account();
    if (!account || account.estado !== 'ACTIVA' || account.saldo !== 0 || this.saving()) return;
    this.error.set('');
    this.saving.set(true);
    this.service.cerrarCuenta(account.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigate(['/cuentas', account.id]);
      },
      error: (reason: unknown) => {
        this.saving.set(false);
        this.error.set(reason instanceof Error ? reason.message : 'No se pudo cerrar la cuenta. Intentá nuevamente.');
      }
    });
  }
}
