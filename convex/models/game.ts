import { Doc } from '../_generated/dataModel';

export type PopulatedGame = Omit<
  Doc<'game'>,
  'boardgame' | 'currentPlayer' | 'players' | 'winner'
> & {
  boardgame: Doc<'boardgame'>;
  currentPlayer: Doc<'player'>;
  players: Doc<'player'>[];
  winner: Doc<'player'> | null;
};
