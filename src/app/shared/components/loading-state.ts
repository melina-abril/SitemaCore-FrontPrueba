import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  template: '<p role="status" aria-live="polite">{{ message() }}</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingState {
  readonly message = input('Cargando datos…');
}
