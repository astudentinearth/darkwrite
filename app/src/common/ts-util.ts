/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Removes the first parameter of given function type.
 */
export type OmitFirstParameter<Func extends (...args: any[]) => any> =
  Func extends (first: any, ...rest: infer Rest) => infer Return
    ? (...args: Rest) => Return
    : never;

/** Gets the last argument from a function signature. */
export type GetLastArg<Func extends (...args: any[]) => any> =
  Parameters<Func> extends [...unknown[], infer Last] ? Last : never;

/**
 * Defines a predicate function that takes a value type and any number of additional arguments.
 * @template ValueType type of the value parameter (`unknown` by default)
 * @template ArgsType a tuple containing any additional parameters. (none by default)
 */
export type Predicate<ValueType = unknown, ArgsType extends any[] = []> = (
  value: ValueType,
  ...args: ArgsType
) => boolean;

export type IndexedPredicate<ValueType = unknown> = Predicate<
  ValueType,
  [index: number]
>;

export type Promisfy<Type> =
  Type extends Promise<Awaited<Type>> ? Type : Promise<Type>;

export type PromisfyFunction<Func extends (...args: any[]) => any> = (
  ...args: Parameters<Func>
) => Promisfy<ReturnType<Func>>;

export type ExcludeFunctions<Obj extends {[key: string]: any}> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [Key in keyof Obj]: Obj[Key] extends Function ? never : Key
}

export type KeysExceptFunctions<T> = ExcludeFunctions<T>[keyof T];