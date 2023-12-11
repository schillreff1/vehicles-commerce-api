export function exclude<Objectt, Key extends keyof Objectt>(
  object: Objectt,
  keys: Key[],
): Omit<Objectt, Key> {
  for (const key of keys) {
    delete object[key];
  }
  return object;
}
