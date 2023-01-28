/**
 * Go inspired error handling for asynchronous functions.
 *
 * ### Example Usage
 *
 * ```ts
 * import p from "p-flat";
 *
 * const [res, err] = await p(someAsyncWork(...args));
 *
 * if (err !== null) {
 *   // If `err` is not `null`, some error or value has been thrown
 *   // `res` will be `null` and cannot be used safely here
 *   // Error handling for `someAsyncWork` should be done here
 *   console.error(err);
 *   return;
 * }
 *
 * // Else, `res` will be the correct return type and value of `someAsyncWork`
 * console.log(res);
 * ```
 */
async function p<T, U extends NonNullable<unknown>>(
  fn: Promise<T>
): Promise<[T, null] | [null, U]> {
  try {
    return [await fn, null];
  } catch (error) {
    return [null, error ?? new Error("[p-flat] unknown nullish error")];
  }
}

export default p;
