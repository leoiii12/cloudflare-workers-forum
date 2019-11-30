import { compose, filter, map } from 'rambda'

export function parseVals<T>(vals: Array<string | null>): T[] {
  const parse = compose(
    map<string, T>((val: string) => JSON.parse(val)),
    filter<any>((val: any) => val !== null),
  )

  return parse(vals)
}
