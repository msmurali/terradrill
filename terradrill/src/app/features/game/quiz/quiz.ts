import { Component, computed, effect, input, OnInit, output, signal } from '@angular/core';
import { Country } from '../../../interfaces/country.interface';
import { Answer } from '../../../interfaces/answer';
import { GameService } from '../../../services/game.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
})
export class Quiz {
  target = input.required<Country | null>();
  options = input.required<Country[]>();
  quizAnswered = output<Answer>();

  protected answer = signal<Country | null>(null);
  protected answered = signal<boolean>(false);

  constructor(readonly gameService: GameService) {
    effect(() => {
      const target = this.target();
      this.answered.set(false);
    });
  }

  onAnswer(_: Event, answer: Country) {
    this.answer.set(answer);
    this.quizAnswered.emit({ answer, target: this.target() });
    this.answered.set(true);
  }
}
