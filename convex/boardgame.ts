import { v } from 'convex/values';

import { Id } from './_generated/dataModel';
import { query } from './_generated/server';

export const list = query({
  args: {
    size: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return args.size
      ? await ctx.db.query('boardgame').take(args.size)
      : await ctx.db.query('boardgame').collect();
  },
});

export const get = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const boardgame = await ctx.db
      .query('boardgame')
      .withIndex('by_name', (q) => q.eq('name', args.name))
      .unique();

    if (!boardgame) {
      throw new Error(`Boardgame "${args.name}" not found`);
    }

    const logoUrl = await ctx.storage.getUrl(
      boardgame.logoId as Id<'_storage'>
    );

    return {
      ...boardgame,
      logoUrl,
    };
  },
});
