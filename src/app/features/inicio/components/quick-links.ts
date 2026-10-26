import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quick-links',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './quick-links.html',
  styleUrl: './quick-links.scss'
})
export class QuickLinks {
  readonly isSupervisor = input.required<boolean>();
}
