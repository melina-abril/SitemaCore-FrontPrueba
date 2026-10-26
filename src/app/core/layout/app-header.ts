import { Component, computed, inject } from '@angular/core';
import { CurrentUser } from '../session/current-user';
import { readSessionView } from './session-view';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss'
})
export class AppHeader {
  private readonly currentUser = inject(CurrentUser);
  public readonly session = computed(() => readSessionView(this.currentUser));
}
