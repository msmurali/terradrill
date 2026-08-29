import { Injectable, signal } from '@angular/core';

/**
 * Chrome/Edge expose the unprefixed constructor, Safari only the webkit one,
 * Firefox neither.
 */
const SpeechRecognitionCtor =
  typeof SpeechRecognition !== 'undefined'
    ? SpeechRecognition
    : typeof webkitSpeechRecognition !== 'undefined'
      ? webkitSpeechRecognition
      : undefined;

@Injectable({ providedIn: 'root' })
export class SpeechRecognitionService {
  /** False on Firefox — drives the fallback message. */
  readonly supported = !!SpeechRecognitionCtor;

  private readonly _transcript = signal('');
  private readonly _listening = signal(false);
  private readonly _error = signal<SpeechRecognitionErrorCode | null>(null);

  readonly transcript = this._transcript.asReadonly();
  /** Driven by the recogniser itself, not by the tap — it stops on its own. */
  readonly listening = this._listening.asReadonly();
  readonly error = this._error.asReadonly();

  private recognition?: SpeechRecognition;

  /** Built on first use, not at injection, so the mic prompt follows a tap. */
  private create(): SpeechRecognition | undefined {
    if (!SpeechRecognitionCtor) return undefined;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      this._error.set(null);
      this._listening.set(true);
    };

    recognition.onresult = (event) => {
      // results is a list of results; each result is a list of alternatives
      // ranked by confidence, so [0] is the best guess for that result.
      const result = event.results[event.results.length - 1];
      this._transcript.set(result[0].transcript.trim());
    };

    recognition.onerror = (event) => this._error.set(event.error);

    // Fires after a result too, since continuous is false.
    recognition.onend = () => this._listening.set(false);

    return recognition;
  }

  start(): void {
    this.recognition ??= this.create();
    if (!this.recognition || this._listening()) return;

    this._transcript.set('');
    this.recognition.start();
  }

  stop(): void {
    this.recognition?.stop();
  }

  /** Clears what was heard — call when a new round starts. */
  reset(): void {
    this._transcript.set('');
    this._error.set(null);
  }

  toggle(): void {
    this._listening() ? this.stop() : this.start();
  }
}
