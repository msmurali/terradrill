import { Component } from '@angular/core';
import { ModeSwitcher } from './mode-switcher/mode-switcher';
import { Mode } from '../../../interfaces/mode';
import { ANSWER_MODES, GAME_MODES } from '../../../core/modes';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-header',
  imports: [ModeSwitcher],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  gameModes: Mode[] = GAME_MODES;
  answerModes: Mode[] = ANSWER_MODES;

  constructor(readonly gameService: GameService) {}

  onGameModeChange(mode: Mode) {
    this.gameService.setGameMode(mode);
  }

  onAnswerModeChange(mode: Mode) {
    this.gameService.setAnswerMode(mode);
  }

  onChangeSound() {
    this.gameService.toggleSound();
  }
}
