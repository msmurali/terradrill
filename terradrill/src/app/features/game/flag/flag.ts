import { Component, computed, effect, ElementRef, input, viewChild } from '@angular/core';
import { Country } from '../../../interfaces/country.interface';
import { GameService } from '../../../services/game.service';
import { flagUrl } from '../../../utils/flag-url.util';

const FLIP_MS = 520;

@Component({
  selector: 'app-flag',
  imports: [],
  templateUrl: './flag.html',
  styleUrl: './flag.scss',
})
export class Flag {
  round = input.required<number>();
  country = input.required<Country | null>();
  flagSrc = computed(() => flagUrl(this.country()?.code));

  private readonly flagImg = viewChild<ElementRef<HTMLImageElement>>('flagImg');

  constructor(readonly gameService: GameService) {
    effect(() => {
      this.country();

      const el = this.flagImg()?.nativeElement;
      if (!el || this.prefersReducedMotion()) return;

      el.animate(
        [
          { transform: 'perspective(1200px) rotateY(-90deg)', opacity: 0 },
          { transform: 'perspective(1200px) rotateY(0deg)', opacity: 1 },
        ],
        { duration: FLIP_MS, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      );
    });
  }

  private prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
