import { Doc } from '../_generated/dataModel';
import type { ConfigDoc } from './config';

export type PopulatedGame = Omit<
  Doc<'game'>,
  'boardgame' | 'currentPlayer' | 'players' | 'winner' | 'config'
> & {
  boardgame: Doc<'boardgame'>;
  currentPlayer: Doc<'player'>;
  players: Doc<'player'>[];
  config: ConfigDoc;
  winner: Doc<'player'> | null;
};
