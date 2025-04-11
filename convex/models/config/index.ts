import { v } from 'convex/values';

import type { Doc } from '../../_generated/dataModel';
import { CatanConfigCustomProps } from './catan';
import { ScytheConfigCustomProps } from './scythe';

export * from './base';
export * from './catan';
export * from './scythe';

export type ConfigCustomProps =
  | CatanConfigCustomProps
  | ScytheConfigCustomProps;

export const configId = v.union(v.id('catanConfig'), v.id('scytheConfig'));

export type ConfigDoc = Doc<'catanConfig'> | Doc<'scytheConfig'>;
