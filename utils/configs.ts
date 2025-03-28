import { api } from '~/convex/_generated/api';
import {
  catanConfigCustomProps,
  scytheConfigCustomProps,
} from '~/convex/models';
import { TypeMap } from '~/types';

export function getConfigAttributes(boardgameName: string): {
  configApiEndpoints: any;
  configCustomProps: { [key: string]: keyof TypeMap };
} {
  switch (boardgameName) {
    case 'Catan': {
      return {
        configApiEndpoints: api.config.catan,
        configCustomProps: catanConfigCustomProps,
      };
    }
    // case 'Forêt Mixte': {
    //   return 'foretMixteConfigs';
    // }
    case 'Scythe': {
      return {
        configApiEndpoints: api.config.scythe,
        configCustomProps: scytheConfigCustomProps,
      };
    }
    // case 'Terraforming Mars': {
    //   return 'terraformingMarsConfigs';
    // }
    default: {
      throw new Error('Unknown boardgame: ' + boardgameName);
    }
  }
}

const falseBool = ['false', 'non', 'no', 'faux'];
const trueBool = ['true', 'oui', 'yes', 'vrai'];

export function checkType(value: string, type: keyof TypeMap): Boolean {
  if (value === '') {
    return false;
  }

  try {
    switch (type) {
      case 'number':
        return !isNaN(Number(value));
      case 'integer':
        return !isNaN(Number(value)) && Number.isInteger(Number(value));
      case 'string':
        return typeof value === 'string';
      case 'boolean':
        return [falseBool, trueBool].flat().includes(value);
      default: {
        console.error(`Unknown type for check: ${type}`);
        return false;
      }
    }
  } catch (err) {
    console.error('Type check failed with error', err);
    return false;
  }
}

export function convert(
  value: string,
  type: keyof TypeMap
): TypeMap[keyof TypeMap] {
  let res: TypeMap[keyof TypeMap] = value;
  try {
    switch (type) {
      case 'number': {
        res = Number(value);
        break;
      }
      case 'integer': {
        res = BigInt(value);
        break;
      }
      case 'string': {
        break;
      }
      case 'boolean': {
        res = falseBool.includes(res)
          ? false
          : trueBool.includes(res)
            ? true
            : Boolean(res);
        break;
      }
      default: {
        throw new Error(`Unknown type for convertion: ${type}`);
      }
    }
  } catch (err) {
    if (!/Unknown type for convertion/i.test((err as Error).message)) {
      console.error('Type conversion failed with error', err);
    }
  }

  return res;
}
