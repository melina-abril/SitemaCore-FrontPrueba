import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quick-links',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="card" aria-label="Accesos directos">
      <h2>Accesos directos</h2>
      <div class="links">
        <a class="quick-link" routerLink="/clientes">Clientes</a>
        <a class="quick-link" routerLink="/cuentas">Cuentas</a>
        <a class="quick-link" routerLink="/movimientos">Movimientos</a>
        @if (role() === 'SUPERVISOR') {
          <a class="quick-link" routerLink="/cierre">Cierre diario</a>
        }
      </div>
    </nav>
  `,
  styles: [`
    h2 { margin-top: 0; font-size: 1.1rem; }
    .links { display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); gap: .75rem; }
    .quick-link { display: block; padding: 1rem; border: 1px solid var(--border); border-radius: .6rem; color: var(--primary); font-weight: 600; text-decoration: none; }
    .quick-link:hover, .quick-link:focus-visible { background: var(--bg); text-decoration: underline; }
  `]
})
export class QuickLinks {
  readonly role = input.required<string>();
}
