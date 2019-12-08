import { transformAndValidate } from 'class-transformer-validator'
import { IsDefined, IsString } from 'class-validator'

import { KVNamespace } from '@cloudflare/workers-types'

import { getUserKey } from '../../../entity'
import { getCachedVal } from '../../../lib/cache'
import { Out } from '../../../lib/out'

declare const USERS: KVNamespace

export class UpdateUserInput {
  @IsDefined()
  @IsString()
  public id: string
}

export async function updateUser(request: Request): Promise<Response> {
  const json = await request.json()
  const input = (await transformAndValidate(
    UpdateUserInput,
    json,
  )) as UpdateUserInput

  await getCachedVal(getUserKey(input.id), USERS, 'USERS', true)

  return Out.ok()
}
