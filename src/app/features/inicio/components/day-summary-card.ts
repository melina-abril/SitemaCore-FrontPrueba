import { Component, input } from '@angular/core';
import { ResumenDiaDto } from '../models/inicio.models';

@Component({
  selector: 'app-day-summary-card',
  standalone: true,
  templateUrl: './day-summary-card.html',
  styleUrl: './day-summary-card.scss'
})
export class DaySummaryCard {
  readonly summary = input.required<ResumenDiaDto>();
}
