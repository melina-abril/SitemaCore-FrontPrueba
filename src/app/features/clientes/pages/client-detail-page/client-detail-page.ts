import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrentUserService } from '../../../../core/session/current-user';
import { ClientesService } from '../../data-access/clientes.service';
import { ClientResponse } from '../../models/clientes.models';

@Component({ selector: 'app-client-detail-page', standalone: true, imports: [RouterLink], templateUrl: './client-detail-page.html', styleUrl: './client-detail-page.scss' })
export class ClientDetailPage implements OnInit {
  private readonly service = inject(ClientesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly session = inject(CurrentUserService);
  readonly id = Number(this.route.snapshot.paramMap.get('id'));
  readonly confirming = this.route.snapshot.routeConfig?.path === ':id/deactivate';
  readonly client = signal<ClientResponse | null>(null);
  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly error = signal('');

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.service.getClient(this.id).subscribe({
      next: client => { this.client.set(client); this.loading.set(false); },
      error: () => { this.error.set('No se pudo cargar el cliente.'); this.loading.set(false); }
    });
  }

  deactivate(): void {
    if (!this.confirming || this.session.user().role !== 'SUPERVISOR' || !this.client() || this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.service.deactivateClient(this.id).subscribe({
      next: client => { this.client.set(client); this.busy.set(false); void this.router.navigate(['/clientes', client.id]); },
      error: error => { this.error.set(error instanceof Error ? error.message : 'No se pudo dar de baja al cliente.'); this.busy.set(false); }
    });
  }
}
