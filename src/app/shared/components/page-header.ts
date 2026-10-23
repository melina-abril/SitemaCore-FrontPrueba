import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: '<div class="page-header"><div><h1 class="page-title">{{ title() }}</h1>@if (description()) { <p class="muted">{{ description() }}</p> }</div><div class="page-actions"><ng-content /></div></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly description = input('');
}
