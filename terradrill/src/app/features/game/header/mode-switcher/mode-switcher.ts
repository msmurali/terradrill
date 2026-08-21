import { Component, input } from '@angular/core';
import { Mode } from '../../../../interfaces/mode';

@Component({
  selector: 'app-mode-switcher',
  imports: [],
  templateUrl: './mode-switcher.html',
  styleUrl: './mode-switcher.scss',
})
export class ModeSwitcher {
  modes = input<Mode[]>();
  activeMode = input<Mode>();
}
