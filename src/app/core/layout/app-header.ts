import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUser } from '../session/current-user';
import { AutenticacionService } from '../../features/autenticacion/data-access/autenticacion.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeader {
  protected readonly currentUser = inject(CurrentUser);
  protected readonly closing = signal(false);
  private readonly auth = inject(AutenticacionService);
  private readonly router = inject(Router);

  protected logout(): void {
    if (this.closing()) {
      return;
    }
    this.closing.set(true);
    this.auth.logout().subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout()
    });
  }

  private finishLogout(): void {
    this.currentUser.clear();
    this.closing.set(false);
    void this.router.navigate(['/login']);
  }
}
