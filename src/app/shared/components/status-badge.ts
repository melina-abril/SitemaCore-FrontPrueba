import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: '<span class="badge" [class.low]="tone() === \u0027low\u0027" [class.medium]="tone() === \u0027medium\u0027" [class.high]="tone() === \u0027high\u0027">{{ label() || status() }}</span>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusBadge {
  readonly status = input.required<string>();
  readonly label = input('');
  readonly tone = computed(() => {
    const value = this.status().toUpperCase();
    if (['ACTIVO', 'ABIERTA', 'COMPLETADO', 'CERRADO'].includes(value)) return 'low';
    if (['FALLIDO', 'INACTIVO', 'ERROR'].includes(value)) return 'high';
    return 'medium';
  });
}
