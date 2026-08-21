import { Component, input } from '@angular/core';
import { Country } from '../../../interfaces/country.interface';

@Component({
  selector: 'app-quiz',
  imports: [],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
})
export class Quiz {
  target = input<Country>();
  options = input<Country[]>();
}
