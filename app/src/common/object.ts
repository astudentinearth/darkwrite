import { Predicate } from "./ts-util";

/**
 * Retrieves the value of a given nested key in an object.
 * @param obj
 * @param keys key names sorted from the top to bottom
 * @returns the value of the key. Value may be a reference and is not copied.
 */
export function find(obj: object, keys: string[]): unknown {
  let value = obj;
  for (const k of keys) {
    value = value[k as keyof typeof value];
  }
  return value;
}

/**
 * Recursively traverses an object to get every possible key path.
 * @param obj
 * @param predicate function to filter values.
 * @returns A 2-dimensional array containing key paths.
 */
export function recursiveKeys(obj: object, predicate?: Predicate) {
  const result: string[][] = [];
  const search = (keys: string[]) => {
    if (predicate == undefined) {
      result.push(keys);
    } else if (predicate(find(obj, keys))) {
      result.push(keys);
    }
    const next = find(obj, keys);
    if (typeof next === "object" && !Array.isArray(next)) {
      for (const k in next) {
        search(keys.concat(k));
      }
    }
  };
  for (const key in obj) {
    search([key]);
  }
  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = { [key: string]: any };
//TODO: make type safe later
export function deepAssign<DestType extends object, ValueType>(
  dest: DestType,
  keyPath: string[],
  value: ValueType,
) {
  let step: AnyObject = dest;
  for (let keyIndex = 0; keyIndex < keyPath.length; keyIndex++) {
    const key = keyPath[keyIndex];
    if (keyIndex === keyPath.length - 1) {
      Object.defineProperty<AnyObject>(step, key, {
        value,
        configurable: true,
        enumerable: true,
        writable: true,
      });
      // step[key] = value;
      break;
    } else if (step[key] === undefined || Object.keys(step[key]).length === 0) {
      Object.defineProperty<AnyObject>(step, key, {
        value: {},
        configurable: true,
        enumerable: true,
        writable: true,
      });
      // step[key] = {};
      step = step[key];
    } else {
      step = step[key];
    }
  }
  return dest;
}
