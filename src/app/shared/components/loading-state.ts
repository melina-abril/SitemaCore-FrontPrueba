import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  template: '<p role="status" aria-live="polite">Cargando datos…</p>'
})
export class LoadingState {}
