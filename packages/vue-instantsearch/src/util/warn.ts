const cache = new Set<string>();

export function warn(message: string) {
  if (cache.has(message)) return;
  cache.add(message);
  // eslint-disable-next-line no-console
  console.warn(message);
}
