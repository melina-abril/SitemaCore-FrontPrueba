import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CurrentUser } from '../../../../core/session/current-user';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { PageHeader } from '../../../../shared/components/page-header';
import { LoadState } from '../../../../shared/models/load-state';
import { ClientesService } from '../../data-access/clientes.service';
import { ClientResponse } from '../../models/client.models';

@Component({
  selector: 'app-client-list-page',
  standalone: true,
  imports: [RouterLink, EmptyState, ErrorAlert, LoadingState, PageHeader],
  templateUrl: './client-list-page.html',
  styleUrl: './client-list-page.scss'
})
export class ClientListPage {
  private readonly service = inject(ClientesService);
  private readonly destroyRef = inject(DestroyRef);
  readonly currentUser = inject(CurrentUser);
  readonly query = signal('');
  readonly state = signal<LoadState<ClientResponse[]>>({ status: 'loading' });

  constructor() {
    this.search();
  }

  search(): void {
    this.state.set({ status: 'loading' });
    this.service.buscarClientes(this.query()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: clients => this.state.set(clients.length ? { status: 'ready', data: clients } : { status: 'empty' }),
      error: () => this.state.set({ status: 'error', message: 'No se pudieron cargar los clientes. Inténtalo de nuevo.' })
    });
  }

  clearSearch(): void {
    this.query.set('');
    this.search();
  }
}
