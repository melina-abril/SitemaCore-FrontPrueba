import { Component, input } from '@angular/core';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  template: '<div class="alert" role="alert">{{ message() }}</div>'
})
export class ErrorAlert {
  public readonly message = input.required<string>();
}
