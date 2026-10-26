import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CurrentUser } from '../session/current-user';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNav {
  readonly session = inject(CurrentUser);
  readonly links = [
    { path: '/inicio', label: 'Inicio' },
    { path: '/clientes', label: 'Clientes' },
    { path: '/cuentas', label: 'Cuentas' },
    { path: '/movimientos', label: 'Movimientos' }
  ];
}
