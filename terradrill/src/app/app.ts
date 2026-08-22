import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './features/game/header/header';
import { Flag } from './features/game/flag/flag';
import { Quiz } from './features/game/quiz/quiz';
import { GameService } from './services/game.service';
import { Answer } from './interfaces/answer';

@Component({
  selector: 'app-root',
  imports: [Header, Flag, Quiz],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(readonly gameService: GameService) {}

  onQuizAnswered(answer: Answer) {
    this.gameService.onAnswer(answer.answer);
  }
}
