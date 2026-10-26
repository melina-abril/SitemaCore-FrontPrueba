import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  template: '<p class="loading-state" role="status" aria-live="polite">Cargando…</p>',
  styles: ['.loading-state { color: var(--muted); padding: 1rem; text-align: center; }']
})
export class LoadingState {}
