import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './features/game/header/header';
import { Flag } from './features/game/flag/flag';
import { Quiz } from './features/game/quiz/quiz';
import { GameService } from './services/game.service';
import { Answer } from './interfaces/answer';
import { GameMode } from './core/modes';
import { Globe } from "./features/game/globe/globe";
import { GeoService } from './services/geo.service';

@Component({
  selector: 'app-root',
  imports: [Header, Flag, Quiz, Globe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly gameModes = GameMode;

  constructor(
    readonly gameService: GameService,
    geoService: GeoService,
  ) {
    // Warm the map data at startup so switching to World Map is instant.
    // Fire-and-forget: it must not delay the first paint, and GeoService
    // holds its own error state for the globe to render.
    geoService.load();
  }

  onQuizAnswered(answer: Answer) {
    this.gameService.onAnswer(answer.answer);
  }
}
