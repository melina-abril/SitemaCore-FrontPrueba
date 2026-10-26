import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrentUser } from '../../../../core/session/current-user';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import type { LoadState } from '../../../../shared/models/load-state';
import { ClientesService } from '../../data-access/clientes.service';
import type { ClientResponse } from '../../models/clientes.models';

@Component({ selector: 'app-client-list', standalone: true, imports: [RouterLink, EmptyState, ErrorAlert, LoadingState], templateUrl: './client-list.html', styleUrl: './client-list.scss' })
export class ClientList {
  private readonly service = inject(ClientesService);
  public readonly currentUser = inject(CurrentUser);
  public readonly state = signal<LoadState<ClientResponse[]>>({ status: 'loading' });
  public search = '';

  public constructor() { this.load(); }

  public load(): void {
    this.state.set({ status: 'loading' });
    this.service.buscarClientes(this.search).subscribe({
      next: clients => this.state.set(clients.length ? { status: 'ready', data: clients } : { status: 'empty' }),
      error: () => this.state.set({ status: 'error', message: 'No se pudo cargar el maestro de clientes.' })
    });
  }
}
