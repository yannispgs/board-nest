import { CatanConfigCustomProps } from './catan';
import { ScytheConfigCustomProps } from './scythe';

export * from './base';
export * from './catan';
export * from './scythe';

export type ConfigCustomProps =
  | CatanConfigCustomProps
  | ScytheConfigCustomProps;
