import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CurrentUser } from '../../../../core/session/current-user';
import { DaySummaryCard } from '../../components/day-summary-card';
import { QuickLinks } from '../../components/quick-links';
import { InicioService } from '../../data-access/inicio.service';
import type { DailySummary } from '../../models/inicio.models';

@Component({
  selector: 'app-inicio-page',
  standalone: true,
  imports: [DaySummaryCard, QuickLinks],
  templateUrl: './inicio-page.html',
  styleUrl: './inicio-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InicioPage implements OnInit {
  private readonly inicioService = inject(InicioService);
  readonly currentUser = inject(CurrentUser);
  readonly summary = signal<DailySummary | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.error.set(false);
    this.summary.set(null);
    this.inicioService.getDailySummary().subscribe({
      next: summary => {
        this.summary.set(summary);
        this.loading.set(false);
      },
      error: () => {
        this.summary.set(null);
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }
}
