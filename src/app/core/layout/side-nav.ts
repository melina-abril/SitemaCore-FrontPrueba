import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CurrentUser } from '../session/current-user';
import { sessionView } from './session-view';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.scss'
})
export class SideNav {
  private readonly session = inject(CurrentUser);
  readonly isSupervisor = computed(() => sessionView(this.session).isSupervisor);
}
