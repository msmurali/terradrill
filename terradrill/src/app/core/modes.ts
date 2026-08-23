import { Mode } from '../interfaces/mode';

export enum GameMode {
  FLAG = 'flag',
  WORLD_MAP = 'world_map',
}

export enum AnswerMode {
  QUIZ = 'quiz',
  VOICE = 'voice',
}

export const FLAG_GAME_MODE = {
  label: 'Flags',
  mode: GameMode.FLAG,
};

export const WORLD_MAP_GAME_MODE = {
  label: 'World Map',
  mode: GameMode.WORLD_MAP,
};

export const GAME_MODES: Mode[] = [FLAG_GAME_MODE, WORLD_MAP_GAME_MODE];

export const QUIZ_ANSWER_MODE = {
  label: 'Quiz',
  mode: 'quiz',
};

export const VOICE_ANSWER_MODE = {
  label: 'Voice',
  mode: 'voice',
};

export const ANSWER_MODES: Mode[] = [QUIZ_ANSWER_MODE, VOICE_ANSWER_MODE];
