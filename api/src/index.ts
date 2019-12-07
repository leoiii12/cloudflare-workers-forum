import { KVNamespace } from '@cloudflare/workers-types'

import { InternalServerError } from './err/InternalServerError'
import { UnauthorizedError } from './err/UnauthorizedError'
import { UserFriendlyError } from './err/userFriendlyError'
import { CategoryModule } from './func/category'
import { PostModule } from './func/post'
import { ReplyModule } from './func/reply'
import { UserModule } from './func/user'
import { Out } from './lib/out'

declare const EXCEPTIONS: KVNamespace

addEventListener('fetch', async event => {
  event.respondWith(safeHandleRequest(event.request))
})

export async function safeHandleRequest(request: Request) {
  try {
    return await handleRequest(request)
  } catch (e) {
    console.log(e)

    if (e instanceof InternalServerError) {
      return Out.internalError(e.message)
    }
    if (e instanceof UnauthorizedError) {
      return Out.unauthorized()
    }
    if (e instanceof UserFriendlyError) {
      return Out.error(e.message)
    }

    // EXCEPTIONS.put()

    return Out.internalError((e as Error).message)
  }
}

export async function handleRequest(request: Request) {
  if (request.url === '/' && request.method === 'GET') {
    return Out.ok('Hello World.')
  }
  if (request.method === 'OPTIONS') {
    return Out.ok()
  }

  const modules = [CategoryModule, PostModule, ReplyModule, UserModule]

  for (const module of modules) {
    for (const routeObj of Object.values(module)) {
      if (
        request.url.endsWith(routeObj.path) &&
        routeObj.methods.includes(request.method)
      ) {
        return routeObj.func(request)
      }
    }
  }

  return Out.notFound()
}
