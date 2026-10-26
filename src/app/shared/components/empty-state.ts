import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: '<p class="empty" role="status">{{ message() }}</p>'
})
export class EmptyState {
  public readonly message = input.required<string>();
}
