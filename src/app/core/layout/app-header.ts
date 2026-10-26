import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrentUserService, UserRole } from '../session/current-user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeader {
  readonly session = inject(CurrentUserService);

  changeRole(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'OPERADOR' || value === 'SUPERVISOR') {
      this.session.setRole(value as UserRole);
    }
  }
}
