import { v } from 'convex/values';

import { query } from '../_generated/server';

export const list = query({
  handler: async (ctx) => {
    const catanConfigs = await ctx.db.query('catanConfig').collect();
    const scytheConfigs = await ctx.db.query('scytheConfig').collect();

    return [
      ...catanConfigs.map((config) => ({
        ...config,
        boardgame: 'Catan',
      })),
      ...scytheConfigs.map((config) => ({
        ...config,
        boardgame: 'Scythe',
      })),
    ];
  },
});

export const get = query({
  args: {
    name: v.string(),
    boardgame: v.string(),
  },
  handler: async (ctx, args) => {
    switch (args.boardgame) {
      case 'Catan':
        return await ctx.db
          .query('catanConfig')
          .filter((q) => q.eq(q.field('name'), args.name))
          .first();
      case 'Scythe':
        return await ctx.db
          .query('scytheConfig')
          .filter((q) => q.eq(q.field('name'), args.name))
          .first();
      default:
        throw new Error(`Unknown boardgame: ${args.boardgame}`);
    }
  },
});

export const getDefault = query({
  args: {
    boardgame: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      switch (args.boardgame) {
        case 'Catan':
          return await ctx.db
            .query('catanConfig')
            .filter((q) => q.eq(q.field('name'), 'Default'))
            .first();
        case 'Scythe':
          return await ctx.db
            .query('scytheConfig')
            .filter((q) => q.eq(q.field('name'), 'Default'))
            .first();
        default:
          throw new Error(`Unknown boardgame: ${args.boardgame}`);
      }
    } catch (error) {
      console.error(
        `Error getting default config for boargame ${args.boardgame} :`,
        error
      );
      throw new Error(
        `Error getting default config for boardgame ${args.boardgame}`
      );
    }
  },
});
