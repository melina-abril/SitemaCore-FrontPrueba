import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientRequest } from '../models/clientes.models';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './client-form.html',
  styleUrl: './client-form.scss'
})
export class ClientForm {
  readonly busy = input(false);
  readonly submitted = output<ClientRequest>();
  request: ClientRequest = { name: '', document: '', email: null, phone: null, address: null };

  submit(): void {
    if (!this.request.name.trim() || !this.request.document.trim()) return;
    this.submitted.emit({
      name: this.request.name.trim(),
      document: this.request.document.trim(),
      email: this.request.email?.trim() || null,
      phone: this.request.phone?.trim() || null,
      address: this.request.address?.trim() || null
    });
  }
}
