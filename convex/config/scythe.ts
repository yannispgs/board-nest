import { v } from 'convex/values';

import { mutation, query } from '../_generated/server';
import { scytheConfigCustomSchema, scytheConfigSchema } from '../models';

export const list = query({
  args: {
    filter: v.optional(v.string()),
    size: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return args.size
      ? await ctx.db.query('scytheConfig').take(args.size)
      : await ctx.db.query('scytheConfig').collect();
  },
});

export const get = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('scytheConfig')
      .withIndex('by_name', (q) => q.eq('name', args.name))
      .unique();
  },
});

export const exists = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return (await ctx.db
      .query('scytheConfig')
      .withIndex('by_name', (q) => q.eq('name', args.name))
      .unique())
      ? true
      : false;
  },
});

export const create = mutation({
  args: scytheConfigSchema,
  handler: async (ctx, args) => {
    return await ctx.db.insert('scytheConfig', {
      name: args.name,
      boardgame: args.boardgame,
      scythe: args.scythe,
      texte: args.texte,
      entier: args.entier,
      reel: args.reel,
      vrai: args.vrai,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id('scytheConfig'),
    propsUpdated: v.object(scytheConfigCustomSchema),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      ...args.propsUpdated,
    });
  },
});
