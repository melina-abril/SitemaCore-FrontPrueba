import { DecimalPipe } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CurrentUserService } from '../../../../core/session/current-user';
import { CloseSummary } from '../../components/close-summary';
import { CierreService } from '../../data-access/cierre.service';
import { DailyClose } from '../../models/cierre.models';

@Component({
  selector: 'app-cierre-page',
  standalone: true,
  imports: [RouterLink, DecimalPipe, CloseSummary],
  templateUrl: './cierre-page.html',
  styleUrl: './cierre-page.scss'
})
export class CierrePage {
  private readonly service = inject(CierreService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly currentUser = inject(CurrentUserService);
  readonly isSupervisor = computed(() => this.currentUser.user().role === 'SUPERVISOR');
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly close = signal<DailyClose | null>(null);
  readonly history = signal<DailyClose[]>([]);
  readonly balances = computed(() => Object.entries(this.close()?.saldosCierre ?? {}).map(([account, amount]) => ({ account, amount })));

  constructor() { this.reload(); }

  reload(): void {
    this.loading.set(true);
    this.error.set(false);
    forkJoin({ close: this.service.getDailyClose(), history: this.service.listDailyCloses() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ close, history }) => {
          this.close.set(close);
          this.history.set(history);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        }
      });
  }
}
