import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrentUser } from '../../../../core/session/current-user';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { PageHeader } from '../../../../shared/components/page-header';
import { ClientesService } from '../../data-access/clientes.service';
import { ClientResponse } from '../../models/client.models';

@Component({
  selector: 'app-client-deactivation-page',
  standalone: true,
  imports: [RouterLink, EmptyState, ErrorAlert, LoadingState, PageHeader],
  templateUrl: './client-deactivation-page.html',
  styleUrl: './client-deactivation-page.scss'
})
export class ClientDeactivationPage {
  private readonly service = inject(ClientesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly currentUser = inject(CurrentUser);
  readonly id = Number(this.route.snapshot.paramMap.get('id'));
  readonly client = signal<ClientResponse | null>(null);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly error = signal('');

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.service.obtenerCliente(this.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: client => {
        this.client.set(client);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el cliente.');
        this.loading.set(false);
      }
    });
  }

  deactivate(): void {
    if (!this.currentUser.isSupervisor() || this.submitting() || this.client()?.status !== 'ACTIVE') return;
    this.error.set('');
    this.submitting.set(true);
    this.service.darDeBajaCliente(this.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => void this.router.navigate(['/clientes']),
      error: (reason: unknown) => {
        this.submitting.set(false);
        this.error.set(reason instanceof Error ? reason.message : 'No se pudo dar de baja al cliente.');
      }
    });
  }
}
