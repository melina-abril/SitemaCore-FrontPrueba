import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { ResumenDiaDto } from '../models/inicio.models';

@Component({
  selector: 'app-day-summary-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './day-summary-card.html',
  styleUrl: './day-summary-card.scss'
})
export class DaySummaryCard {
  readonly summary = input.required<ResumenDiaDto>();
  readonly closureLabel = computed(() => {
    switch (this.summary().estadoCierre.toUpperCase()) {
      case 'PENDIENTE': return 'Pendiente';
      case 'EN_CURSO': return 'En curso';
      case 'COMPLETADO': return 'Completado';
      default: return this.summary().estadoCierre;
    }
  });
  readonly closureClass = computed(() => {
    switch (this.summary().estadoCierre.toUpperCase()) {
      case 'COMPLETADO': return 'ok';
      case 'EN_CURSO': return 'warn';
      default: return '';
    }
  });
}
