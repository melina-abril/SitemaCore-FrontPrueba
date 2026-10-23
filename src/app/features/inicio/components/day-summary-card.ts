import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { DailySummary } from '../models/inicio.models';

@Component({
  selector: 'app-day-summary-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card" aria-labelledby="day-summary-title">
      <h2 id="day-summary-title">Resumen del día</h2>
      <div class="summary-grid">
        <div class="stat">
          <span class="stat-label">Fecha operativa</span>
          <strong class="date-value">{{ formattedDate() }}</strong>
        </div>
        <div class="stat">
          <span class="stat-label">Movimientos cargados</span>
          <strong class="stat-value">{{ summary().movementCount }}</strong>
        </div>
        <div class="stat">
          <span class="stat-label">Estado del cierre</span>
          <strong class="status-value">{{ statusLabel() }}</strong>
        </div>
      </div>
    </section>
  `,
  styles: [`
    h2 { margin-top: 0; font-size: 1.1rem; }
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr)); gap: 1.5rem; }
    .date-value, .status-value { display: block; margin-top: .4rem; font-size: 1.25rem; color: var(--text); }
  `]
})
export class DaySummaryCard {
  readonly summary = input.required<DailySummary>();

  formattedDate(): string {
    const value = this.summary().operationalDate;
    const parts = value.split('-').map(Number);
    if (parts.length !== 3 || parts.some(part => !Number.isInteger(part))) return value;
    const [year, month, day] = parts;
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return value;
    return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  }

  statusLabel(): string {
    switch (this.summary().closureStatus.toUpperCase()) {
      case 'PENDIENTE': return 'Pendiente';
      case 'EN_CURSO': return 'En curso';
      case 'COMPLETADO': return 'Completado';
      default: return this.summary().closureStatus;
    }
  }
}
