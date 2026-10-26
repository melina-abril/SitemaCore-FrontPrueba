import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: '<header class="page-header"><h1 class="page-title">{{ title() }}</h1><ng-content /></header>',
  styles: ['.page-header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; } .page-title { margin: 0; color: var(--text); }']
})
export class PageHeader {
  readonly title = input.required<string>();
}
