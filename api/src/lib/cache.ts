import { KVNamespace } from '@cloudflare/workers-types'

declare const caches: { default: any }

export async function getCachedEntityVal(
  key: string,
  kvNamespace: KVNamespace,
  cacheNamespace: string,
  isForceRefreshing: boolean = false,
): Promise<string | null> {
  if (isForceRefreshing === false) {
    const cachedEntityValRes = (await caches.default.match(
      `https://cache.lecom.cloud/${cacheNamespace}/${key}`,
    )) as Response
    if (cachedEntityValRes !== undefined && cachedEntityValRes !== null) {
      console.log(
        `Cache hitted. key=[${key}], kvNamespace=[${kvNamespace}], cacheNamespace=[${cacheNamespace}].`,
      )
      return cachedEntityValRes.text()
    }
  }

  const entityVal = await kvNamespace.get(key)
  if (entityVal === null) {
    return null
  }

  await caches.default.put(
    `https://cache.lecom.cloud/${cacheNamespace}/${key}`,
    new Response(entityVal),
  )

  return entityVal
}

export async function getCachedEntityVals(
  keys: string[],
  kvNamespace: KVNamespace,
  cacheNamespace: string,
  isForceRefreshing: boolean = false,
) {
  const promises = keys.map(k => {
    return getCachedEntityVal(k, kvNamespace, cacheNamespace, isForceRefreshing)
  })

  return Promise.all(promises)
}
