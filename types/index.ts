export * from './enums';

/**
 * Type matrix between Convex types and JS types
 */
export interface TypeMap {
  boolean: boolean;
  integer: bigint;
  number: number;
  string: string;
}

export type configPropsType = { [key: string]: keyof TypeMap };
