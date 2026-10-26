import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrentUser } from '../../../../core/session/current-user';
import { DaySummaryCard } from '../../components/day-summary-card';
import { QuickLinks } from '../../components/quick-links';
import { InicioService } from '../../data-access/inicio.service';
import { ResumenDiaDto } from '../../models/inicio.models';

@Component({
  selector: 'app-inicio-page',
  standalone: true,
  imports: [DaySummaryCard, QuickLinks],
  templateUrl: './inicio-page.html',
  styleUrl: './inicio-page.scss'
})
export class InicioPage implements OnInit {
  private readonly service = inject(InicioService);
  private readonly destroyRef = inject(DestroyRef);
  readonly currentUser = inject(CurrentUser);
  readonly state = signal<'loading' | 'ready' | 'empty' | 'error'>('loading');
  readonly summary = signal<ResumenDiaDto | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.summary.set(null);
    this.state.set('loading');
    this.service.obtenerResumenDia().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: summary => {
        this.summary.set(summary);
        this.state.set(summary ? 'ready' : 'empty');
      },
      error: () => {
        this.summary.set(null);
        this.state.set('error');
      }
    });
  }
}
