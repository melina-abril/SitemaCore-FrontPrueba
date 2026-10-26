import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrentUser } from '../../../core/session/current-user';

@Component({
  selector: 'app-quick-links',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './quick-links.html',
  styleUrl: './quick-links.scss'
})
export class QuickLinks {
  public readonly currentUser = inject(CurrentUser);
}
