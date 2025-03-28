import { v } from 'convex/values';

import { TypeMap } from '../../../types';
import { overloadBaseConfigSchema } from './base';

export interface CatanConfigCustomProps {
  catan: string;
}

export const catanConfigCustomProps: { catan: keyof TypeMap } = {
  catan: 'string',
};

export const catanConfigCustomSchema = {
  catan: v.string(),
};

export const catanConfigSchema =
  overloadBaseConfigSchema<CatanConfigCustomProps>(catanConfigCustomSchema);
