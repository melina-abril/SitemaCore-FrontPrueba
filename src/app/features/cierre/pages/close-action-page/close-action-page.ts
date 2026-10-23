import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CierreService } from '../../data-access/cierre.service';
import { DailyClose } from '../../models/cierre.models';

@Component({
  selector: 'app-close-action-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './close-action-page.html',
  styleUrl: './close-action-page.scss'
})
export class CloseActionPage {
  private readonly service = inject(CierreService);
  private readonly destroyRef = inject(DestroyRef);
  readonly retry = inject(ActivatedRoute).snapshot.data['action'] === 'retry';
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly error = signal('');
  readonly close = signal<DailyClose | null>(null);
  readonly finished = signal(false);

  constructor() { this.refresh(); }

  refresh(): void {
    this.loading.set(true);
    this.error.set('');
    this.service.getDailyClose().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: close => { this.close.set(close); this.loading.set(false); },
      error: () => { this.error.set('No se pudo consultar el estado del cierre.'); this.loading.set(false); }
    });
  }

  confirm(): void {
    const close = this.close();
    if (this.submitting() || !close || (this.retry ? close.estado !== 'CON_ERROR' : close.estado !== 'PENDIENTE')) return;
    this.submitting.set(true);
    this.error.set('');
    const request = this.retry ? this.service.retryDailyClose() : this.service.executeDailyClose();
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.close.set(result);
        this.finished.set(true);
        this.submitting.set(false);
      },
      error: () => {
        this.error.set('No se pudo completar el cierre. El día permanece abierto; consultá el estado antes de volver a intentarlo.');
        this.submitting.set(false);
        this.refresh();
      }
    });
  }
}
