import { map } from 'rambda'

import { KVNamespace } from '@cloudflare/workers-types'

declare const caches: { default: any }

export async function getCachedVal(
  key: string,
  kvNamespace: KVNamespace,
  cacheNamespace: string,
  isForceRefreshing: boolean = false,
): Promise<string | null> {
  if (isForceRefreshing === false) {
    const cachedValRes = (await caches.default.match(
      `https://cache.lecom.cloud/${cacheNamespace}/${key}`,
    )) as Response
    if (cachedValRes !== undefined && cachedValRes !== null) {
      console.log(
        `Cache hitted. key=[${key}], kvNamespace=[${kvNamespace}], cacheNamespace=[${cacheNamespace}].`,
      )
      return cachedValRes.text()
    }
  }

  const val = await kvNamespace.get(key)
  if (val === null) {
    return null
  }

  await caches.default.put(
    `https://cache.lecom.cloud/${cacheNamespace}/${key}`,
    new Response(val),
  )

  return val
}

export async function getCachedVals(
  keys: string[],
  kvNamespace: KVNamespace,
  cacheNamespace: string,
) {
  return Promise.all(
    map<string, Promise<string | null>>(k =>
      getCachedVal(k, kvNamespace, cacheNamespace),
    )(keys),
  )
}
