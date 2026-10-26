import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrentUser } from '../../../../core/session/current-user';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import type { LoadState } from '../../../../shared/models/load-state';
import { CuentasService } from '../../data-access/cuentas.service';
import type { AccountDetail } from '../../models/cuentas.models';

@Component({
  selector: 'app-account-detail-page',
  standalone: true,
  imports: [DatePipe, DecimalPipe, RouterLink, EmptyState, ErrorAlert, LoadingState],
  templateUrl: './account-detail-page.html',
  styleUrl: './account-detail-page.scss'
})
export class AccountDetailPage {
  private readonly service = inject(CuentasService);
  private readonly route = inject(ActivatedRoute);
  public readonly currentUser = inject(CurrentUser);
  public readonly state = signal<LoadState<AccountDetail>>({ status: 'loading' });

  public constructor() {
    this.load();
  }

  public load(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isSafeInteger(id) || id <= 0) {
      this.state.set({ status: 'error', message: 'El número de cuenta no es válido.' });
      return;
    }
    this.state.set({ status: 'loading' });
    this.service.obtenerCuenta(id).subscribe({
      next: (account) => this.state.set({ status: 'ready', data: account }),
      error: () => this.state.set({ status: 'error', message: 'No se pudo obtener el detalle de la cuenta.' })
    });
  }
}
