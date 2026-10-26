import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: '<p class="empty" role="status">{{ message() }}</p>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyState {
  readonly message = input('No hay resultados para mostrar.');
}
