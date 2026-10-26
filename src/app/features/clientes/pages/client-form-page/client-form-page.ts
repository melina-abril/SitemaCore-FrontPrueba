import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientForm } from '../../components/client-form';
import { ClientesService } from '../../data-access/clientes.service';
import { ClientRequest } from '../../models/clientes.models';

@Component({ selector: 'app-client-form-page', standalone: true, imports: [RouterLink, ClientForm], templateUrl: './client-form-page.html', styleUrl: './client-form-page.scss' })
export class ClientFormPage implements OnInit {
  private readonly service = inject(ClientesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly form = viewChild(ClientForm);
  readonly id = Number(this.route.snapshot.paramMap.get('id')) || null;
  readonly loading = signal(!!this.id);
  readonly busy = signal(false);
  readonly error = signal('');

  ngOnInit(): void { if (this.id) this.load(); }

  load(): void {
    if (!this.id) return;
    this.loading.set(true);
    this.error.set('');
    this.service.getClient(this.id).subscribe({
      next: client => {
        const form = this.form();
        if (form) form.request = { name: client.name, document: client.document, email: client.email, phone: client.phone, address: client.address };
        this.loading.set(false);
      },
      error: () => { this.error.set('No se pudo cargar el cliente.'); this.loading.set(false); }
    });
  }

  save(request: ClientRequest): void {
    this.busy.set(true);
    this.error.set('');
    const operation = this.id ? this.service.updateClient(this.id, request) : this.service.createClient(request);
    operation.subscribe({
      next: client => { this.busy.set(false); void this.router.navigate(['/clientes', client.id]); },
      error: error => { this.busy.set(false); this.error.set(error instanceof Error ? error.message : 'No se pudo guardar el cliente. Verifique los datos e intente nuevamente.'); }
    });
  }
}
