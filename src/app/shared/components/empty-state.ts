import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: '<p class="empty">{{ message() }}</p>'
})
export class EmptyState {
  readonly message = input<string>('No hay datos disponibles');
}
