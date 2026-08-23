import { Injectable, signal } from '@angular/core';
import { GameSound } from '../core/game-sound';
import { GameService } from './game.service';

@Injectable({ providedIn: 'root' })
export class GameSoundService {
  private readonly _sound = signal<boolean>(true);
  private readonly soundClips = new Map<GameSound, HTMLAudioElement>(
    Object.keys(GameSound).map((k) => {
      const name = GameSound[k as keyof typeof GameSound];
      const audio = new Audio(`assets/audio/${name}.wav`);
      audio.preload = 'auto';
      return [name, audio];
    }),
  );

  readonly sound = this._sound.asReadonly();

  toggleSound() {
    this._sound.update((sound) => !sound);
  }

  correct() {
    this.play(GameSound.CORRECT);
  }

  wrong() {
    this.play(GameSound.WRONG);
  }

  tick() {
    this.play(GameSound.TICK);
  }

  play(name: GameSound) {
    const soundClip = this.soundClips.get(name);
    if (this.sound() && soundClip) {
      soundClip.currentTime = 0;
      soundClip.play().catch(() => {});
    }
  }

  constructor() {}
}
