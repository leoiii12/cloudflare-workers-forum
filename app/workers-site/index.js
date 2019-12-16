import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 */
const DEBUG = false

addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event))
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        }),
      )
    }
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})

async function handleEvent(event) {
  let options = {}

  try {
    if (DEBUG) {
      // customize caching
      options.cacheControl = {
        bypassCache: true,
      }
    }
    return await getAssetFromKV(event, options)
  } catch (e) {
    // this is a SPA
    // assume all requests are valid,
    // if the asset does not exist, just return index.html is fine.
    try {
      let notFoundResponse = await getAssetFromKV(event, {
        mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req),
      })

      return new Response(notFoundResponse.body, { ...notFoundResponse, status: 200 })
    } catch (e) { }
  }
}