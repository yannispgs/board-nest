import { v } from 'convex/values';

// Each Boardgame config overload the base config with custom props
export const overloadBaseConfigSchema = <T>(props: {
  [K in keyof T]: any;
}) => ({
  name: v.string(),
  boardgame: v.id('boardgame'),
  turnDuration: v.int64(),
  ...props,
});
