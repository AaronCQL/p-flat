async function p<T>(
  asyncFunction: Promise<T>
): Promise<[T, null] | [T, unknown]> {
  try {
    return [await asyncFunction, null];
  } catch (error: unknown) {
    return [null as unknown as T, error];
  }
}

export default p;
