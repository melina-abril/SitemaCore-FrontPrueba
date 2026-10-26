import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { PageHeader } from '../../../../shared/components/page-header';
import { ClientesService } from '../../data-access/clientes.service';
import { ClientRequest, ClientResponse } from '../../models/client.models';

@Component({
  selector: 'app-client-form-page',
  standalone: true,
  imports: [RouterLink, EmptyState, ErrorAlert, LoadingState, PageHeader],
  templateUrl: './client-form-page.html',
  styleUrl: './client-form-page.scss'
})
export class ClientFormPage {
  private readonly service = inject(ClientesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly id = this.route.snapshot.paramMap.has('id') ? Number(this.route.snapshot.paramMap.get('id')) : null;
  readonly loading = signal(this.id !== null);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly saved = signal(false);
  readonly client = signal<ClientResponse | null>(null);
  readonly form = signal<ClientRequest>({ document: '', name: '', email: null, phone: null });

  constructor() {
    if (this.id !== null) this.load();
  }

  load(): void {
    if (this.id === null) return;
    this.loading.set(true);
    this.error.set('');
    this.service.obtenerCliente(this.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: client => {
        this.client.set(client);
        this.form.set({ document: client.document, name: client.name, email: client.email, phone: client.phone });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el cliente.');
        this.loading.set(false);
      }
    });
  }

  update(field: keyof ClientRequest, value: string): void {
    this.form.update(form => ({ ...form, [field]: value }));
  }

  save(): void {
    if (this.saving() || this.loading()) return;
    const request = this.form();
    this.error.set('');
    this.saved.set(false);
    if (!request.document.trim() || !request.name.trim()) {
      this.error.set('El documento y el nombre son obligatorios.');
      return;
    }
    if (request.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) {
      this.error.set('Ingresa un correo electrónico válido.');
      return;
    }
    this.saving.set(true);
    const operation = this.id === null
      ? this.service.crearCliente(request)
      : this.service.actualizarCliente(this.id, request);
    operation.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: client => {
        this.saving.set(false);
        this.saved.set(true);
        this.client.set(client);
        if (this.id === null) void this.router.navigate(['/clientes', client.id]);
      },
      error: (reason: unknown) => {
        this.saving.set(false);
        this.error.set(reason instanceof Error ? reason.message : 'No se pudo guardar el cliente. Inténtalo de nuevo.');
      }
    });
  }
}
