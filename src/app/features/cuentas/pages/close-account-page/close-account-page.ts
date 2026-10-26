import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrentUser } from '../../../../core/session/current-user';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import type { LoadState } from '../../../../shared/models/load-state';
import { CuentasService } from '../../data-access/cuentas.service';
import type { AccountDetail } from '../../models/cuentas.models';

@Component({
  selector: 'app-close-account-page',
  standalone: true,
  imports: [DecimalPipe, RouterLink, ErrorAlert, LoadingState],
  templateUrl: './close-account-page.html',
  styleUrl: './close-account-page.scss'
})
export class CloseAccountPage {
  private readonly service = inject(CuentasService);
  private readonly route = inject(ActivatedRoute);
  public readonly currentUser = inject(CurrentUser);
  public readonly state = signal<LoadState<AccountDetail>>({ status: 'loading' });
  public readonly closing = signal(false);
  public readonly error = signal('');
  public readonly completed = signal(false);

  public constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isSafeInteger(id) || id <= 0) {
      this.state.set({ status: 'error', message: 'El número de cuenta no es válido.' });
      return;
    }
    this.service.obtenerCuenta(id).subscribe({
      next: (account) => this.state.set({ status: 'ready', data: account }),
      error: () => this.state.set({ status: 'error', message: 'No se pudo consultar la cuenta.' })
    });
  }

  public close(id: number): void {
    if (this.currentUser.user().role !== 'SUPERVISOR' || this.closing()) return;
    this.error.set('');
    this.closing.set(true);
    this.service.cerrarCuenta(id).subscribe({
      next: (account) => {
        this.closing.set(false);
        this.completed.set(true);
        this.state.set({ status: 'ready', data: { ...account, ultimosMovimientos: [] } });
      },
      error: () => {
        this.closing.set(false);
        this.error.set('No se pudo cerrar la cuenta. Debe estar activa y tener saldo cero.');
      }
    });
  }
}
