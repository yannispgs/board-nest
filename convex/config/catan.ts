import { v } from 'convex/values';
import { query, mutation } from '../_generated/server';
import { catanConfigCustomSchema, catanConfigSchema } from '../models';

export const list = query({
  args: {
    filter: v.optional(v.string()),
    size: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return args.size
      ? await ctx.db.query('catanConfig').take(args.size)
      : await ctx.db.query('catanConfig').collect();
  },
});

export const get = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('catanConfig')
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
      .query('catanConfig')
      .withIndex('by_name', (q) => q.eq('name', args.name))
      .unique())
      ? true
      : false;
  },
});

export const create = mutation({
  args: catanConfigSchema,
  handler: async (ctx, args) => {
    return await ctx.db.insert('catanConfig', {
      name: args.name,
      boardgame: args.boardgame,
      catan: args.catan,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id('catanConfig'),
    propsUpdated: v.object(catanConfigCustomSchema),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      ...args.propsUpdated,
    });
  },
});
