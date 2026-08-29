import { Component } from '@angular/core';
import { AnswerMode, GameMode } from './core/modes';
import { AnswerPanel } from './features/game/answer-panel/answer-panel';
import { Flag } from './features/game/flag/flag';
import { Globe } from './features/game/globe/globe';
import { Header } from './features/game/header/header';
import { GameService } from './services/game.service';
import { GeoService } from './services/geo.service';

@Component({
  selector: 'app-root',
  imports: [Header, Flag, Globe, AnswerPanel],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly gameModes = GameMode;
  readonly answerModes = AnswerMode;

  constructor(
    readonly gameService: GameService,
    geoService: GeoService,
  ) {
    geoService.load();
  }
}
