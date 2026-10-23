import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AccountCard } from '../../components/account-card';
import { CuentasService } from '../../data-access/cuentas.service';
import { Account, OpenRequest } from '../../models/cuentas.models';

@Component({
  selector: 'app-accounts-page',
  standalone: true,
  imports: [FormsModule, RouterLink, AccountCard],
  templateUrl: './accounts-page.html',
  styleUrl: './accounts-page.scss'
})
export class AccountsPage implements OnInit {
  private readonly service = inject(CuentasService);
  private readonly route = inject(ActivatedRoute);

  readonly accounts = signal<Account[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly formError = signal('');
  readonly saving = signal(false);
  readonly notice = signal('');
  customerId = 1;
  draftCustomerId = 1;
  type = 'Caja de ahorro';
  currency = 'ARS';

  ngOnInit(): void {
    const requested = Number(this.route.snapshot.queryParamMap.get('customerId'));
    if (Number.isInteger(requested) && requested > 0) {
      this.customerId = requested;
      this.draftCustomerId = requested;
    }
    this.load();
  }

  load(): void {
    if (!Number.isInteger(this.customerId) || this.customerId < 1) {
      this.error.set('Ingresá un número de cliente válido.');
      this.accounts.set([]);
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.notice.set('');
    this.service.listAccounts(this.customerId).subscribe({
      next: accounts => { this.accounts.set(accounts); this.loading.set(false); },
      error: () => { this.error.set('No se pudieron cargar las cuentas. Intentá nuevamente.'); this.loading.set(false); }
    });
  }

  open(): void {
    this.formError.set('');
    this.notice.set('');
    if (!Number.isInteger(this.draftCustomerId) || this.draftCustomerId < 1 || !this.type.trim() || !this.currency.trim()) {
      this.formError.set('Completá todos los datos de la cuenta.');
      return;
    }
    const request: OpenRequest = { customerId: this.draftCustomerId, type: this.type.trim(), currency: this.currency.trim() };
    this.saving.set(true);
    this.service.openAccount(request).subscribe({
      next: account => {
        this.saving.set(false);
        this.notice.set(`Cuenta ${account.number} abierta correctamente.`);
        if (this.customerId === account.customerId) this.accounts.update(items => [...items, account]);
        else { this.customerId = account.customerId; this.load(); this.notice.set(`Cuenta ${account.number} abierta correctamente.`); }
      },
      error: error => { this.saving.set(false); this.formError.set(error instanceof Error ? error.message : 'No se pudo abrir la cuenta. Verificá que el cliente esté activo.'); }
    });
  }
}
