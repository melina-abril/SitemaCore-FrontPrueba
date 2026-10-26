import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrentUserService } from '../../../../core/session/current-user';
import { ClientesService } from '../../data-access/clientes.service';
import { ClientResponse } from '../../models/clientes.models';

@Component({
  selector: 'app-client-list-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './client-list-page.html',
  styleUrl: './client-list-page.scss'
})
export class ClientListPage {
  readonly session = inject(CurrentUserService);
  private readonly service = inject(ClientesService);
  readonly clients = signal<ClientResponse[]>([]);
  readonly search = signal('');
  readonly loading = signal(false);
  readonly error = signal('');

  constructor() { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.service.buscarClientes(this.search()).subscribe({
      next: clients => { this.clients.set(clients); this.loading.set(false); },
      error: () => { this.error.set('No se pudieron cargar los clientes. Intentá nuevamente.'); this.loading.set(false); }
    });
  }
}
