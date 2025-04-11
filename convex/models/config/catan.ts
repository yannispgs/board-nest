import { v } from 'convex/values';

import { TypeMap } from '../../../types';
import { overloadBaseConfigSchema } from './base';

export interface CatanConfigCustomProps {
  catan: string;
  turnDuration: bigint;
}

export const catanConfigCustomProps: {
  catan: keyof TypeMap;
  turnDuration: keyof TypeMap;
} = {
  catan: 'string',
  turnDuration: 'integer',
};

export const catanConfigCustomSchema = {
  catan: v.string(),
  turnDuration: v.int64(),
};

export const catanConfigSchema =
  overloadBaseConfigSchema<CatanConfigCustomProps>(catanConfigCustomSchema);
