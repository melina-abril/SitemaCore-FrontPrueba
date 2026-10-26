import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import type { ResumenDia } from '../models/inicio.models';

@Component({
  selector: 'app-day-summary-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './day-summary-card.html',
  styleUrl: './day-summary-card.scss'
})
export class DaySummaryCard {
  public readonly summary = input.required<ResumenDia>();

  public readonly closureLabel = computed(() => {
    switch (this.summary().estadoCierre.toUpperCase()) {
      case 'EN_CURSO': return 'En curso';
      case 'COMPLETADO': return 'Completado';
      case 'PENDIENTE': return 'Pendiente';
      default: return this.summary().estadoCierre;
    }
  });

  public readonly closureClass = computed(() => {
    switch (this.summary().estadoCierre.toUpperCase()) {
      case 'COMPLETADO': return 'completed';
      case 'EN_CURSO': return 'in-progress';
      default: return 'pending';
    }
  });
}
