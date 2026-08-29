import { Component } from '@angular/core';
import { Voice } from '../voice/voice';
import { Quiz } from '../quiz/quiz';
import { GameService } from '../../../services/game.service';
import { AnswerMode, GameMode } from '../../../core/modes';
import { Answer } from '../../../interfaces/answer';

@Component({
  selector: 'app-answer-panel',
  imports: [Voice, Quiz],
  templateUrl: './answer-panel.html',
  styleUrl: './answer-panel.scss',
})
export class AnswerPanel {
  readonly answerModes = AnswerMode;
  readonly gameModes = GameMode;

  constructor(readonly gameService: GameService) {}

  onQuizAnswered(answer: Answer) {
    this.gameService.onAnswer(answer.answer);
  }
}
