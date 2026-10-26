import { DecimalPipe, KeyValuePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import type { DailyClosing } from '../models/cierre.models';

@Component({
  selector: 'app-closing-summary',
  standalone: true,
  imports: [DecimalPipe, KeyValuePipe],
  templateUrl: './closing-summary.html',
  styleUrl: './closing-summary.scss'
})
export class ClosingSummary {
  public readonly closing = input.required<DailyClosing>();
}
