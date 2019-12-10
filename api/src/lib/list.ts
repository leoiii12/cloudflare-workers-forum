export function parseVals<T>(vals: Array<string | null>): T[] {
  return vals
    .filter(val => val !== null)
    .map((val: unknown) => JSON.parse(val as string) as T)
}
