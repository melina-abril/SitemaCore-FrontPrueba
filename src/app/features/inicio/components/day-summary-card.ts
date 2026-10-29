import { Component, computed, input } from '@angular/core';

import { EstadoCierre, ResumenDia } from '../models/inicio.models';

const ESTADO_LABEL: Record<EstadoCierre, string> = {
  PENDIENTE: 'Pendiente',
  EN_CURSO: 'En curso',
  COMPLETADO: 'Completado',
};

@Component({
  selector: 'app-day-summary-card',
  template: `
    <div class="summary-grid">
      <article class="card summary-card">
        <div class="card-heading">
          <span>Movimientos cargados</span>
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M4 12h16M4 17h10"/><circle cx="18" cy="17" r="2"/></svg>
          </span>
        </div>
        <div class="card-value">
          <strong class="movement-count">{{ resumen().cantidadMovimientos }}</strong>
          <span class="hint">Registrados en la fecha operativa vigente</span>
        </div>
      </article>
      <article class="card summary-card">
        <div class="card-heading">
          <span>Fecha operativa vigente</span>
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></svg>
          </span>
        </div>
        <div class="card-value">
          <strong class="date-value">{{ fechaLegible() }}</strong>
          <span class="hint">{{ anio() }}</span>
        </div>
      </article>
      <article class="card summary-card">
        <div class="card-heading">
          <span>Estado del cierre</span>
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h5M8 16h3m-1 0 2 2 3-3"/></svg>
          </span>
        </div>
        <span class="badge" [class.pending]="resumen().estadoCierre === 'PENDIENTE'" [class.completed]="resumen().estadoCierre === 'COMPLETADO'">
          <span class="badge-dot" aria-hidden="true"></span>{{ estadoCierre() }}
        </span>
        <div class="states">
          <span>Estados posibles:</span>
          <span class="state pending">Pendiente</span>
          <span class="state in-progress">En curso</span>
          <span class="state completed">Completado</span>
        </div>
      </article>
    </div>
  `,
  styles: `
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }
    .summary-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-height: 166px;
      box-sizing: border-box;
      padding: 20px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
    }
    .card-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      color: var(--text-secondary);
      font-size: 13px;
    }
    .icon {
      display: grid;
      place-items: center;
      flex: none;
      width: 30px;
      height: 30px;
      border-radius: 6px;
      background: var(--soft-background);
      color: var(--accent);
    }
    svg {
      width: 18px;
      height: 18px;
    }
    .card-value {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-top: auto;
    }
    .movement-count {
      font-size: 30px;
      line-height: 1.15;
      letter-spacing: -0.03em;
    }
    .date-value {
      font-size: 20px;
      line-height: 1.3;
      letter-spacing: -0.02em;
    }
    .hint {
      color: var(--text-secondary);
      font-size: 12px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      align-self: flex-start;
      gap: 6px;
      padding: 5px 9px;
      border-radius: 6px;
      background: var(--soft-background);
      color: var(--primary);
      font-size: 12px;
      font-weight: 700;
    }
    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent);
    }
    .states {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      margin-top: auto;
      color: var(--text-secondary);
      font-size: 11px;
    }
    .state {
      padding: 3px 6px;
      border-radius: 6px;
    }
    .pending {
      background: var(--soft-background);
      color: var(--warning);
    }
    .in-progress {
      background: var(--soft-background);
      color: var(--primary);
    }
    .completed {
      background: var(--soft-background);
      color: var(--success);
    }
    .badge.pending .badge-dot {
      background: var(--warning);
    }
    .badge.completed .badge-dot {
      background: var(--success);
    }
    @media (max-width: 800px) {
      .summary-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class DaySummaryCard {
  readonly resumen = input.required<ResumenDia>();

  protected readonly estadoCierre = computed(() => ESTADO_LABEL[this.resumen().estadoCierre]);
  protected readonly anio = computed(() => this.resumen().fechaOperativa.slice(0, 4));
  protected readonly fechaLegible = computed(() => {
    const [year, month, day] = this.resumen().fechaOperativa.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const formatted = new Intl.DateTimeFormat('es', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      timeZone: 'UTC',
    }).format(date);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  });
}
