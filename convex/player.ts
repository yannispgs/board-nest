import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {
    filter: v.optional(v.string()),
    size: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return args.size
      ? await ctx.db.query('player').take(args.size)
      : await ctx.db.query('player').collect();
  },
});

export const get = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('player')
      .withIndex('by_name', (p) => p.eq('name', args.name))
      .unique();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('player', { name: args.name });
  },
});

export const remove = mutation({
  args: {
    id: v.id('player'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
