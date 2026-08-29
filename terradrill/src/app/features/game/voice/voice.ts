import { Component, Signal, computed, effect, signal, untracked } from '@angular/core';
import { GameMode } from '../../../core/modes';
import { CountryService } from '../../../services/country-service';
import { GameService } from '../../../services/game.service';
import { SpeechRecognitionService } from '../../../services/speech-recognition.service';
import { matchCountry } from '../../../utils/match-country.util';

@Component({
  selector: 'app-voice',
  imports: [],
  templateUrl: './voice.html',
  styleUrl: './voice.scss',
})
export class Voice {
  readonly gameModes = GameMode;
  readonly errorMessage: Signal<string | null>;

  /** Heard something, but it wasn't one of the four options. */
  readonly unmatched = signal(false);

  constructor(
    readonly gameService: GameService,
    readonly speechRecognitionService: SpeechRecognitionService,
    private countryService: CountryService,
  ) {
    this.errorMessage = computed(() => {
      switch (this.speechRecognitionService.error()) {
        case 'not-allowed':
        case 'service-not-allowed':
          return 'Microphone access is blocked. Allow it in your browser settings.';
        case 'no-speech':
          return "Didn't catch that — try again.";
        case 'audio-capture':
          return 'No microphone found.';
        case 'network':
          return 'Speech recognition needs a connection.';
        default:
          return null;
      }
    });

    // A new target means a new round — clear what was heard last time.
    effect(() => {
      this.gameService.targetCountry();

      untracked(() => {
        this.unmatched.set(false);
        this.speechRecognitionService.reset();
      });
    });

    effect(() => {
      const transcript = this.speechRecognitionService.transcript();
      if (!transcript) return;

      untracked(() => {
        // Already answered and waiting to advance — ignore further speech.
        if (this.gameService.freeze()) return;

        // Matched against every country, not just the four options: naming a
        // real but wrong country is a wrong answer, same as tapping one in
        // quiz mode. Only genuine non-matches ask the player to retry.
        const match = matchCountry(transcript, this.countryService.all());

        this.unmatched.set(!match);
        if (match) this.gameService.onAnswer(match);
      });
    });
  }

  toggleListening() {
    this.unmatched.set(false);
    this.speechRecognitionService.toggle();
  }
}
