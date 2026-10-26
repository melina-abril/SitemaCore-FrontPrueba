import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quick-links',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './quick-links.html',
  styleUrl: './quick-links.scss'
})
export class QuickLinks {
  readonly role = input.required<string>();
  readonly links = [
    { label: 'Clientes', path: '/clientes', description: 'Consultar el maestro de clientes' },
    { label: 'Cuentas', path: '/cuentas', description: 'Consultar las cuentas de clientes' },
    { label: 'Movimientos', path: '/movimientos', description: 'Consultar y registrar movimientos' }
  ];
}
