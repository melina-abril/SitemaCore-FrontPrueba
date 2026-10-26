import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CurrentUser } from '../session/current-user';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeader {
  readonly session = inject(CurrentUser);
}
