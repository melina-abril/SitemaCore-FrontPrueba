import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClientesService } from '../../data-access/clientes.service';
import { ClientResponse, ClientSearch } from '../../models/clientes.models';

@Component({ selector: 'app-client-list-page', standalone: true, imports: [FormsModule, RouterLink], templateUrl: './client-list-page.html', styleUrl: './client-list-page.scss' })
export class ClientListPage implements OnInit {
  private readonly clientsService = inject(ClientesService);
  readonly clients = signal<ClientResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  filters: ClientSearch = { name: '', document: '', number: '' };

  ngOnInit(): void { this.search(); }

  search(): void {
    this.loading.set(true);
    this.error.set('');
    this.clientsService.searchClients(this.filters).subscribe({
      next: clients => { this.clients.set(clients); this.loading.set(false); },
      error: () => { this.error.set('No se pudieron cargar los clientes. Intente nuevamente.'); this.loading.set(false); }
    });
  }
}
