import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Account } from '../models/cuentas.models';

@Component({
  selector: 'app-account-card',
  standalone: true,
  imports: [RouterLink],
  template: `<article class="card account-card">
    <div><strong>{{ account().number }}</strong><p>{{ account().type }} · {{ account().currency }}</p></div>
    <span class="chip">{{ account().status === 'OPEN' ? 'Abierta' : 'Cerrada' }}</span>
    <p class="balance">Saldo: {{ account().balance.toLocaleString('es-AR', { minimumFractionDigits: 2 }) }} {{ account().currency }}</p>
    <a class="btn" [routerLink]="['/cuentas', account().id]">Ver detalle</a>
  </article>`,
  styles: [`
    .account-card { display: grid; gap: .65rem; }
    .account-card p { margin: .2rem 0; color: var(--muted); }
    .account-card .balance { color: var(--text); font-weight: 600; }
    .chip { justify-self: start; }
    .btn { justify-self: start; }
  `]
})
export class AccountCard {
  readonly account = input.required<Account>();
}
