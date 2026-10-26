import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CurrentUser } from '../session/current-user';
import { readSessionView } from './session-view';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.scss'
})
export class SideNav {
  private readonly currentUser = inject(CurrentUser);
  public readonly session = computed(() => readSessionView(this.currentUser));
}
