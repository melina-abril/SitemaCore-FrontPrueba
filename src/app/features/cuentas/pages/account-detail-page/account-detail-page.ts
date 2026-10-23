import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrentUser } from '../../../../core/session/current-user';
import { CuentasService } from '../../data-access/cuentas.service';
import { Detail } from '../../models/cuentas.models';

@Component({
  selector: 'app-account-detail-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './account-detail-page.html',
  styleUrl: './account-detail-page.scss'
})
export class AccountDetailPage implements OnInit {
  private readonly service = inject(CuentasService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly user = inject(CurrentUser).user;
  readonly detail = signal<Detail | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly actionError = signal('');
  readonly closing = signal(false);
  readonly closeMode = this.route.snapshot.data['closeMode'] === true;
  readonly id = Number(this.route.snapshot.paramMap.get('id'));

  ngOnInit(): void { this.load(); }

  load(): void {
    if (!Number.isInteger(this.id) || this.id < 1) {
      this.error.set('El identificador de cuenta no es válido.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.service.getAccount(this.id).subscribe({
      next: detail => { this.detail.set(detail); this.loading.set(false); },
      error: () => { this.error.set('No se pudo cargar el detalle de la cuenta.'); this.loading.set(false); }
    });
  }

  close(): void {
    const account = this.detail()?.account;
    if (!this.closeMode || this.user().role !== 'SUPERVISOR' || !account || account.status !== 'OPEN' || account.balance !== 0) return;
    this.closing.set(true);
    this.actionError.set('');
    this.service.closeAccount(account.id).subscribe({
      next: () => { this.closing.set(false); void this.router.navigate(['/cuentas', account.id]); },
      error: error => { this.closing.set(false); this.actionError.set(error instanceof Error ? error.message : 'No se pudo cerrar la cuenta. Intentá nuevamente.'); }
    });
  }
}
