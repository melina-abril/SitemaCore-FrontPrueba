import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNav {
  readonly links = [
    { path: '/inicio', label: 'Inicio' },
    { path: '/clientes', label: 'Clientes' },
    { path: '/cuentas', label: 'Cuentas' },
    { path: '/movimientos', label: 'Movimientos' },
    { path: '/cierre', label: 'Cierre diario' },
  ];
}
