import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AccountSummary } from '../models/cuentas.models';

@Component({
  selector: 'app-account-card',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './account-card.html',
  styleUrl: './account-card.scss'
})
export class AccountCard {
  readonly account = input.required<AccountSummary>();
}
