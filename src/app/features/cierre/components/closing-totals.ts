import { Component, input } from '@angular/core';
import { DecimalPipe, KeyValuePipe } from '@angular/common';
import { CierreDto } from '../models/cierre.models';

@Component({
  selector: 'app-closing-totals',
  standalone: true,
  imports: [DecimalPipe, KeyValuePipe],
  template: `
    <section class="card" aria-label="Resultados del cierre">
      <h2>Resultado de la conciliación</h2>
      <div class="totals">
        <div class="stat"><span class="stat-label">Total de débitos</span><strong class="stat-value">{{ cierre().totalDebitos | number:'1.2-2' }}</strong></div>
        <div class="stat"><span class="stat-label">Total de créditos</span><strong class="stat-value ok">{{ cierre().totalCreditos | number:'1.2-2' }}</strong></div>
      </div>
      <h3>Saldos de cierre por cuenta</h3>
      @for (saldo of cierre().saldosCierre | keyvalue; track saldo.key) {
        <p class="balance"><span>{{ saldo.key }}</span><strong>{{ saldo.value | number:'1.2-2' }}</strong></p>
      } @empty {
        <p class="empty">No hay saldos de cierre disponibles.</p>
      }
    </section>
  `,
  styles: [`
    .totals { display: flex; flex-wrap: wrap; gap: 2rem; margin-bottom: 1rem; }
    .balance { display: flex; justify-content: space-between; gap: 1rem; border-top: 1px solid var(--border); padding-top: .75rem; }
    h2, h3 { color: var(--text); }
  `]
})
export class ClosingTotals {
  readonly cierre = input.required<CierreDto>();
}
