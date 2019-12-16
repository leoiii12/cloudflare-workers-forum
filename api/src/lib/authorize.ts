import { KVNamespace } from '@cloudflare/workers-types'

import { IAccessTokenObj } from '../entity/accessTokenObj'
import { getUserKey, IUser } from '../entity/user/user'
import { UnauthorizedError } from '../err/UnauthorizedError'
import { getCachedEntityVal } from '../lib/cache'
import { verifyJwt } from './jwt'

declare const caches: { default: any }

export async function authorize(
  headerAuthorization: string,
  USERS: KVNamespace,
): Promise<{ userId: string; user: IUser }> {
  if (headerAuthorization === '') {
    throw new UnauthorizedError()
  }

  const accessToken = headerAuthorization.replace('Bearer ', '')
  const accessTokenObj = (await verifyJwt(
    accessToken,
    'TBR',
  )) as IAccessTokenObj

  const userVal = await getCachedEntityVal(
    getUserKey(accessTokenObj.id),
    USERS,
    'USERS',
  )
  if (userVal === null) {
    throw new UnauthorizedError()
  }
  const user = JSON.parse(userVal) as IUser

  return {
    userId: accessTokenObj.id,
    user,
  }
}
