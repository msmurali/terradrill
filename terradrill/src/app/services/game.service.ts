import { Injectable, signal } from '@angular/core';
import { Subject, switchMap, tap, timer } from 'rxjs';
import { FLAG_GAME_MODE, QUIZ_ANSWER_MODE } from '../core/modes';
import { Answer } from '../interfaces/answer';
import { Country } from '../interfaces/country.interface';
import { Mode } from '../interfaces/mode';
import { randomNumberGenerator } from '../utils/random-number.util';
import { CountryService } from './country-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class GameService {
  private countries = signal<Country[]>([]);
  private readonly _targetCountry = signal<Country | null>(null);
  private readonly _strike = signal(0);
  private readonly _score = signal(0);
  private readonly _gameMode = signal<Mode>(FLAG_GAME_MODE);
  private readonly _answerMode = signal<Mode>(QUIZ_ANSWER_MODE);
  private readonly _sound = signal<boolean>(true);
  private readonly _round = signal<number>(1);
  private readonly _options = signal<Country[]>([]);
  private readonly _showInvalidBanner = signal<boolean>(false);
  private readonly _showValidBanner = signal<boolean>(false);
  private readonly _freeze = signal<boolean>(false);

  readonly targetCountry = this._targetCountry.asReadonly();
  readonly strike = this._strike.asReadonly();
  readonly score = this._score.asReadonly();
  readonly gameMode = this._gameMode.asReadonly();
  readonly answerMode = this._answerMode.asReadonly();
  readonly sound = this._sound.asReadonly();
  readonly round = this._round.asReadonly();
  readonly options = this._options.asReadonly();
  readonly showInvalidBanner = this._showInvalidBanner.asReadonly();
  readonly showValidBanner = this._showValidBanner.asReadonly();
  readonly freeze = this._freeze.asReadonly();

  readonly answered$ = new Subject<Answer>();
  readonly advance$ = this.answered$.pipe(
    switchMap(({ target, answer }) =>
      timer(this.validate(answer, target) ? 1800 : 4000).pipe(
        tap(() => {
          this.loadTargetAndOptions();
          this.incrementRound();
        }),
      ),
    ),
  );

  constructor(private countryService: CountryService) {
    this.loadCountries();
    this.loadTargetAndOptions();

    this.advance$.pipe(takeUntilDestroyed()).subscribe();
  }

  loadTargetAndOptions() {
    const randomCountry = this.pickRandomCountry();
    const options = this.pickOptions(randomCountry);

    this.setTargetCountry(randomCountry);
    this.setOptions(options);
    this._showInvalidBanner.set(false);
    this._showValidBanner.set(false);
    this._freeze.set(false);
  }

  setGameMode(mode: Mode) {
    this._gameMode.set(mode);
  }

  setAnswerMode(mode: Mode) {
    this._answerMode.set(mode);
  }

  toggleSound() {
    this._sound.update((sound) => !sound);
  }

  setTargetCountry(country: Country) {
    this._targetCountry.set(country);
  }

  setOptions(options: Country[]) {
    this._options.set(options);
  }

  incrementRound() {
    this._round.update((round) => round + 1);
  }

  incrementScore() {
    this._score.update((score) => score + 1);
  }

  incrementStrike() {
    this._strike.update((strike) => strike + 1);
  }

  onAnswer(answer: Country) {
    const target = this.targetCountry();
    this.answered$.next({ answer, target });
  }

  loadCountries() {
    this.countries.set(this.countryService.all());
  }

  pickRandomCountry(): Country {
    if (this.countries().length === 0) {
      this.loadCountries();
    }

    const index = randomNumberGenerator(0, this.countries().length - 1);
    const country = this.countries()[index];
    this.countries.update((curr) => curr.filter((_, i) => i !== index));

    return country;
  }

  pickOptions(pickedCountry: Country) {
    const options = [pickedCountry];
    const remainingCountries = this.countryService
      .all()
      .filter((c) => c.code !== pickedCountry.code);

    for (let i = 0; i < 3; i++) {
      const index = randomNumberGenerator(0, remainingCountries.length - 1);
      options.push(remainingCountries[index]);
      remainingCountries.splice(index, 1);
    }

    return this.shuffleOptions(options);
  }

  /** Fisher-Yates */
  shuffleOptions(options: Country[]): Country[] {
    const shuffled = [...options];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = randomNumberGenerator(0, i);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  validate(answer: Country, target: Country | null) {
    const valid = answer && target && answer.code === target.code;
    this._showInvalidBanner.set(!valid);
    this._showValidBanner.set(valid || false);
    this._freeze.set(true);
    if (valid) {
      this.incrementStrike();
      this.incrementScore();
    } else {
      this._strike.set(0);
    }
    return valid;
  }

  skipRound() {
    this.loadTargetAndOptions();
  }
}
