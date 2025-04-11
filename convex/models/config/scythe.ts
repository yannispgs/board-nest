import { v } from 'convex/values';

import { TypeMap } from '../../../types';
import { overloadBaseConfigSchema } from './base';

export interface ScytheConfigCustomProps {
  scythe: string;
  texte: string;
  entier: bigint;
  reel: number;
  vrai: boolean;
  turnDuration: bigint;
}

export const scytheConfigCustomProps: {
  scythe: keyof TypeMap;
  texte: keyof TypeMap;
  entier: keyof TypeMap;
  reel: keyof TypeMap;
  vrai: keyof TypeMap;
  turnDuration: keyof TypeMap;
} = {
  scythe: 'string',
  texte: 'string',
  entier: 'integer',
  reel: 'number',
  vrai: 'boolean',
  turnDuration: 'integer',
};

export const scytheConfigCustomSchema = {
  scythe: v.string(),
  texte: v.string(),
  entier: v.int64(),
  reel: v.number(),
  vrai: v.boolean(),
  turnDuration: v.int64(),
};

export const scytheConfigSchema =
  overloadBaseConfigSchema<ScytheConfigCustomProps>(scytheConfigCustomSchema);
