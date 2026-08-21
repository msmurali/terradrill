import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './features/game/header/header';
import { Flag } from "./features/game/flag/flag";
import { Quiz } from "./features/game/quiz/quiz";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Flag, Quiz],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
