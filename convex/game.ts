import { v } from 'convex/values';

import { GameStatuses } from '../types';
import { Doc } from './_generated/dataModel';
import { mutation, query, QueryCtx } from './_generated/server';
import { PopulatedGame } from './models';

export const list = query({
  args: {
    size: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return args.size
      ? await ctx.db.query('game').take(args.size)
      : await ctx.db.query('game').collect();
  },
});

const populateGame = async (ctx: QueryCtx, game: Doc<'game'>) => {
  const boardgame = (await ctx.db.get(game.boardgame))!;

  const currentPlayer = (await ctx.db.get(game.currentPlayer))!;
  const players = await Promise.all(
    game.players.map(async (player) => (await ctx.db.get(player))!)
  );
  const config = (await ctx.db.get(game.config))!;
  const winner = game.winner ? await ctx.db.get(game.winner) : null;

  return {
    ...game,
    boardgame,
    currentPlayer,
    players,
    winner,
    config,
  };
};

export const listPopulated = query({
  args: {
    size: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<PopulatedGame[]> => {
    const games = args.size
      ? await ctx.db.query('game').take(args.size)
      : await ctx.db.query('game').collect();

    return await Promise.all(
      games.map(async (game) => await populateGame(ctx, game))
    );
  },
});

export const getPopulated = query({
  args: {
    id: v.id('game'),
  },
  handler: async (ctx, args) => {
    const game = (await ctx.db.get(args.id))!;

    return await populateGame(ctx, game);
  },
});

export const create = mutation({
  args: {
    boardgame: v.id('boardgame'),
    players: v.array(v.id('player')),
    config: v.union(v.id('catanConfig'), v.id('scytheConfig')),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('game', {
      boardgame: args.boardgame,
      players: args.players,
      currentPlayer: args.players[0],
      config: args.config,
      startDate: new Date().toISOString(),
      status: GameStatuses.ONGOING,
      round: BigInt(1),
      turn: BigInt(1),
    });
  },
});

export const endPlayerTurn = mutation({
  args: {
    id: v.id('game'),
  },
  handler: async (ctx, args) => {
    const game = (await ctx.db.get(args.id))!;

    if (!(Number(game.turn) % game.players.length)) {
      await ctx.db.patch(args.id, { round: game.round + 1n });
    }

    await ctx.db.patch(args.id, {
      currentPlayer: game.players[Number(game.turn) % game.players.length],
    });
    await ctx.db.patch(args.id, { turn: game.turn + 1n });
  },
});

export const endGame = mutation({
  args: {
    id: v.id('game'),
    winner: v.id('player'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: GameStatuses.ENDED,
      winner: args.winner,
    });
  },
});
