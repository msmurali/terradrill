import { Component, effect, input, output, signal } from '@angular/core';
import { GameMode } from '../../../core/modes';
import { Answer } from '../../../interfaces/answer';
import { Country } from '../../../interfaces/country.interface';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
})
export class Quiz {
  readonly gameModes = GameMode;

  target = input.required<Country | null>();
  options = input.required<Country[]>();
  quizAnswered = output<Answer>();

  protected answer = signal<Country | null>(null);
  protected answered = signal<boolean>(false);

  constructor(readonly gameService: GameService) {
    effect(() => {
      this.target();
      this.answered.set(false);
    });
  }

  onAnswer(_: Event, answer: Country) {
    this.answer.set(answer);
    this.quizAnswered.emit({ answer, target: this.target() });
    this.answered.set(true);
  }
}
