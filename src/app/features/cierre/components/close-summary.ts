import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DailyClose } from '../models/cierre.models';

@Component({
  selector: 'app-close-summary',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './close-summary.html',
  styleUrl: './close-summary.scss'
})
export class CloseSummary {
  readonly close = input.required<DailyClose>();
  readonly balances = input.required<{ account: string; amount: number }[]>();
}
