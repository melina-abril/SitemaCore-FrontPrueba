import { Component, computed, inject } from '@angular/core';
import { CurrentUser } from '../session/current-user';
import { sessionView } from './session-view';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss'
})
export class AppHeader {
  private readonly session = inject(CurrentUser);
  readonly user = computed(() => sessionView(this.session));
}
