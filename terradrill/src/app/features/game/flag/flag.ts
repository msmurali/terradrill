import { Component, computed, input } from '@angular/core';
import { Country } from '../../../interfaces/country.interface';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-flag',
  imports: [],
  templateUrl: './flag.html',
  styleUrl: './flag.scss',
})
export class Flag {
  round = input.required<number>();
  country = input.required<Country | null>();
  flagSrc = computed(() => {
    const code = this.country()?.code;
    return `https://flagcdn.com/${code}.svg`;
  });

  constructor(readonly gameService: GameService){}
}
