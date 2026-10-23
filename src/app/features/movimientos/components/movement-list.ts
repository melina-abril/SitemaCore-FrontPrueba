import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MovementResponse } from '../models/movimientos.models';

@Component({
  selector: 'app-movement-list',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './movement-list.html',
  styleUrl: './movement-list.scss'
})
export class MovementList {
  readonly movements = input.required<MovementResponse[]>();
  readonly supervisor = input(false);
  readonly edit = output<MovementResponse>();
  readonly remove = output<MovementResponse>();
  readonly adjust = output<MovementResponse>();
}
