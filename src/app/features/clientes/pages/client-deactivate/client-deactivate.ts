import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import type { LoadState } from '../../../../shared/models/load-state';
import { CurrentUser } from '../../../../core/session/current-user';
import { ClientesService } from '../../data-access/clientes.service';
import type { ClientResponse } from '../../models/clientes.models';

@Component({ selector: 'app-client-deactivate', standalone: true, imports: [RouterLink, ErrorAlert, LoadingState], templateUrl: './client-deactivate.html', styleUrl: './client-deactivate.scss' })
export class ClientDeactivate {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(ClientesService);
  private readonly currentUser = inject(CurrentUser);
  public readonly id = Number(this.route.snapshot.paramMap.get('id'));
  public readonly state = signal<LoadState<ClientResponse>>({ status: 'loading' });
  public readonly submitting = signal(false);
  public readonly error = signal('');

  public constructor() { this.load(); }

  public load(): void {
    if (!Number.isSafeInteger(this.id) || this.id <= 0) { this.state.set({ status: 'error', message: 'Identificador de cliente inválido.' }); return; }
    this.state.set({ status: 'loading' });
    this.service.obtenerCliente(this.id).subscribe({
      next: client => this.state.set({ status: 'ready', data: client }),
      error: () => this.state.set({ status: 'error', message: 'No se pudo cargar el cliente.' })
    });
  }

  public confirm(): void {
    if (this.currentUser.user().role !== 'SUPERVISOR' || this.state().status !== 'ready' || this.submitting()) return;
    this.submitting.set(true);
    this.error.set('');
    this.service.darDeBajaCliente(this.id).subscribe({
      next: () => { this.submitting.set(false); void this.router.navigate(['/clientes']); },
      error: (error: unknown) => { this.submitting.set(false); this.error.set(error instanceof Error ? error.message : 'No se pudo dar de baja al cliente.'); }
    });
  }
}
