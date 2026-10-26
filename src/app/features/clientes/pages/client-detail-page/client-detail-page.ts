import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrentUserService } from '../../../../core/session/current-user';
import { ClientesService } from '../../data-access/clientes.service';
import { ClientRequest, ClientResponse } from '../../models/clientes.models';

@Component({
  selector: 'app-client-detail-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './client-detail-page.html',
  styleUrl: './client-detail-page.scss'
})
export class ClientDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(ClientesService);
  readonly session = inject(CurrentUserService);
  readonly deactivateMode = this.route.snapshot.routeConfig?.path === 'deactivate/:id';
  readonly id = Number(this.route.snapshot.paramMap.get('id'));
  readonly creating = this.route.snapshot.routeConfig?.path === 'new';
  readonly client = signal<ClientResponse | null>(null);
  readonly form = signal<ClientRequest>({ document: '', name: '', email: '', phone: '' });
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');

  constructor() { if (!this.creating) this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.service.obtenerCliente(this.id).subscribe({
      next: client => {
        this.client.set(client);
        this.form.set({ document: client.document, name: client.name, email: client.email, phone: client.phone });
        this.loading.set(false);
      },
      error: () => { this.error.set('No se pudo cargar el cliente.'); this.loading.set(false); }
    });
  }

  setField(field: keyof ClientRequest, value: string): void {
    this.form.update(current => ({ ...current, [field]: value }));
  }

  save(): void {
    const request = this.form();
    if (!request.document.trim() || !request.name.trim()) {
      this.error.set('El documento y el nombre son obligatorios.');
      return;
    }
    this.saving.set(true);
    this.error.set('');
    const operation = this.creating ? this.service.crearCliente(request) : this.service.actualizarCliente(this.id, request);
    operation.subscribe({
      next: client => { this.saving.set(false); void this.router.navigate(['/clientes', client.id]); if (!this.creating) this.client.set(client); },
      error: error => { this.error.set(error instanceof Error ? error.message : 'No se pudieron guardar los cambios.'); this.saving.set(false); }
    });
  }

  deactivate(): void {
    if (this.session.user().role !== 'SUPERVISOR' || !this.client() || this.client()?.status !== 'ACTIVE') return;
    this.saving.set(true);
    this.error.set('');
    this.service.darDeBajaCliente(this.id).subscribe({
      next: () => { this.saving.set(false); void this.router.navigate(['/clientes']); },
      error: error => { this.error.set(error instanceof Error ? error.message : 'No se pudo dar de baja el cliente.'); this.saving.set(false); }
    });
  }
}
