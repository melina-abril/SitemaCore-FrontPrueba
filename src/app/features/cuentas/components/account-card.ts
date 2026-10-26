import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountSummary } from '../models/account.models';

@Component({
  selector: 'app-account-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './account-card.html',
  styleUrl: './account-card.scss'
})
export class AccountCard {
  readonly account = input.required<AccountSummary>();
}
