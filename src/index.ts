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
