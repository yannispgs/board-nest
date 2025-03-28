/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as boardgame from "../boardgame.js";
import type * as config_catan from "../config/catan.js";
import type * as config_scythe from "../config/scythe.js";
import type * as game from "../game.js";
import type * as models_config_base from "../models/config/base.js";
import type * as models_config_catan from "../models/config/catan.js";
import type * as models_config_index from "../models/config/index.js";
import type * as models_config_scythe from "../models/config/scythe.js";
import type * as models_game from "../models/game.js";
import type * as models_index from "../models/index.js";
import type * as player from "../player.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  boardgame: typeof boardgame;
  "config/catan": typeof config_catan;
  "config/scythe": typeof config_scythe;
  game: typeof game;
  "models/config/base": typeof models_config_base;
  "models/config/catan": typeof models_config_catan;
  "models/config/index": typeof models_config_index;
  "models/config/scythe": typeof models_config_scythe;
  "models/game": typeof models_game;
  "models/index": typeof models_index;
  player: typeof player;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
