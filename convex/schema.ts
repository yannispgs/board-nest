import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

import { GameStatuses } from '../types/enums';
import {
  catanConfigSchema,
  overloadBaseConfigSchema,
  scytheConfigSchema,
} from './models';

const schema = defineSchema({
  player: defineTable({
    name: v.string(),
  }).index('by_name', ['name']),
  boardgame: defineTable({
    name: v.string(),
    logoId: v.string(),
  }).index('by_name', ['name']),
  baseConfig: defineTable(overloadBaseConfigSchema({})).index('by_name', [
    'name',
  ]),
  catanConfig: defineTable(catanConfigSchema).index('by_name', ['name']),
  scytheConfig: defineTable(scytheConfigSchema).index('by_name', ['name']),
  game: defineTable({
    boardgame: v.id('boardgame'),
    players: v.array(v.id('player')),
    startDate: v.string(),
    status: v.union(
      ...Object.values(GameStatuses).map((value: string) => v.literal(value))
    ),
    round: v.int64(),
    turn: v.int64(),
    currentPlayer: v.id('player'),
    winner: v.optional(v.id('player')),
  }),
});

export default schema;
