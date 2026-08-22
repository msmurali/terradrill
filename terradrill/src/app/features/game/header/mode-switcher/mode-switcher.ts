import { Component, input, output } from '@angular/core';
import { Mode } from '../../../../interfaces/mode';

@Component({
  selector: 'app-mode-switcher',
  imports: [],
  templateUrl: './mode-switcher.html',
  styleUrl: './mode-switcher.scss',
})
export class ModeSwitcher {
  modes = input.required<Mode[]>();
  activeMode = input.required<Mode>();
  modeChanged = output<Mode>();

  protected onChangeMode(mode: Mode) {
    this.modeChanged.emit(mode);
  }
}
