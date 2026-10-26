import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  template: '<div class="alert" role="alert">{{ message() }}</div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorAlert {
  readonly message = input('No se pudo completar la operación.');
}
