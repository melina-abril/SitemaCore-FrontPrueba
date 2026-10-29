import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AccesoDirecto } from '../models/inicio.models';

const ACCESOS: AccesoDirecto[] = [
  { label: 'Clientes', description: 'Consultar el maestro de clientes', route: '/clientes', icon: 'clientes', soloSupervisor: false },
  { label: 'Cuentas', description: 'Consultar cuentas de clientes', route: '/cuentas', icon: 'cuentas', soloSupervisor: false },
  { label: 'Movimientos', description: 'Ver y registrar movimientos', route: '/movimientos', icon: 'movimientos', soloSupervisor: false },
  { label: 'Cierre diario', description: 'Gestionar el cierre operativo', route: '/cierre-diario', icon: 'cierre', soloSupervisor: true },
];

/** La ruta de cierre también debe protegerse con roleGuard('SUPERVISOR'). */
@Component({
  selector: 'app-quick-links',
  imports: [RouterLink],
  template: `
    <nav class="quick-links" aria-label="Accesos directos">
      @for (acceso of accesos(); track acceso.route) {
        <a class="card access" [class.primary]="acceso.soloSupervisor" [routerLink]="acceso.route">
          <span class="access-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              @switch (acceso.icon) {
                @case ('clientes') {
                  <circle cx="9" cy="8" r="3"/><path d="M3.5 19v-1a5.5 5.5 0 0 1 11 0v1H3.5ZM17 6a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5"/>
                }
                @case ('cuentas') {
                  <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>
                }
                @case ('movimientos') {
                  <path d="M4 7h16M4 12h16M4 17h10"/><circle cx="18" cy="17" r="2"/>
                }
                @case ('cierre') {
                  <rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h5M8 16h3m-1 0 2 2 3-3"/>
                }
              }
            </svg>
          </span>
          <span class="access-content">
            <span class="access-title">{{ acceso.label }}
              <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
            </span>
            <span class="access-description">{{ acceso.description }}</span>
          </span>
        </a>
      }
    </nav>
  `,
  styles: `
    .quick-links {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
    }
    .access {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 20px;
      min-height: 172px;
      box-sizing: border-box;
      padding: 20px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      color: var(--text-primary);
      text-decoration: none;
    }
    .access:hover, .access:focus-visible {
      border-color: var(--accent);
    }
    .access-icon {
      display: grid;
      place-items: center;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: var(--soft-background);
      color: var(--primary);
    }
    .access-icon svg {
      width: 21px;
      height: 21px;
    }
    .access-content {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-top: auto;
    }
    .access-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 15px;
      font-weight: 700;
    }
    .arrow {
      width: 17px;
      height: 17px;
      color: var(--accent);
    }
    .access-description {
      color: var(--text-secondary);
      font-size: 12px;
      line-height: 1.4;
    }
    .primary {
      border-color: var(--primary);
      background: var(--primary);
      color: var(--surface);
    }
    .primary .access-icon {
      background: var(--accent);
      color: var(--surface);
    }
    .primary .arrow, .primary .access-description {
      color: var(--surface);
    }
    @media (max-width: 900px) {
      .quick-links {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    @media (max-width: 520px) {
      .quick-links {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class QuickLinks {
  readonly isSupervisor = input(false);
  protected readonly accesos = computed(() => ACCESOS.filter(
    (acceso) => !acceso.soloSupervisor || this.isSupervisor(),
  ));
}
