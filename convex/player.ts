import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

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

export const update = mutation({
  args: {
    id: v.id('player'),
    newName: v.string(),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.id);

    const existingPlayer = await ctx.db
      .query('player')
      .withIndex('by_name', (p) => p.eq('name', args.newName))
      .unique();

    if (existingPlayer && existingPlayer._id !== player!._id) {
      throw new Error('A player with this name already exists');
    }
    await ctx.db.patch(args.id, { name: args.newName });
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
