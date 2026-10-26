import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import type { LoadState } from '../../../../shared/models/load-state';
import { ClientesService } from '../../data-access/clientes.service';
import type { ClientRequest, ClientResponse } from '../../models/clientes.models';

@Component({ selector: 'app-client-form', standalone: true, imports: [FormsModule, RouterLink, EmptyState, ErrorAlert, LoadingState], templateUrl: './client-form.html', styleUrl: './client-form.scss' })
export class ClientForm {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(ClientesService);
  public readonly id: number | null = this.route.snapshot.paramMap.has('id') ? Number(this.route.snapshot.paramMap.get('id')) : null;
  public readonly state = signal<LoadState<ClientResponse>>({ status: 'loading' });
  public readonly saving = signal(false);
  public readonly saveError = signal('');
  public form: ClientRequest = { document: '', name: '', email: '', phone: '' };

  public constructor() { this.load(); }

  public load(): void {
    if (this.id === null) { this.state.set({ status: 'empty' }); return; }
    if (!Number.isSafeInteger(this.id) || this.id <= 0) { this.state.set({ status: 'error', message: 'Identificador de cliente inválido.' }); return; }
    this.state.set({ status: 'loading' });
    this.service.obtenerCliente(this.id).subscribe({
      next: client => { this.form = { document: client.document, name: client.name, email: client.email, phone: client.phone }; this.state.set({ status: 'ready', data: client }); },
      error: () => this.state.set({ status: 'error', message: 'No se pudo cargar el cliente.' })
    });
  }

  public save(): void {
    if (!this.form.document.trim() || !this.form.name.trim() || this.saving()) return;
    this.saving.set(true);
    this.saveError.set('');
    const request: ClientRequest = { ...this.form, document: this.form.document.trim(), name: this.form.name.trim() };
    const operation = this.id === null ? this.service.crearCliente(request) : this.service.actualizarCliente(this.id, request);
    operation.subscribe({
      next: () => { this.saving.set(false); void this.router.navigate(['/clientes']); },
      error: (error: unknown) => { this.saving.set(false); this.saveError.set(error instanceof Error ? error.message : 'No se pudieron guardar los datos del cliente.'); }
    });
  }
}
