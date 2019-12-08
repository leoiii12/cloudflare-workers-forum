import { transformAndValidate } from 'class-transformer-validator'
import { IsDefined, IsString } from 'class-validator'
import { map } from 'rambda'

import { KVNamespace } from '@cloudflare/workers-types'

import { getUserKey, IUser, UserDto } from '../../../entity'
import { getCachedVals } from '../../../lib/cache'
import { parseVals } from '../../../lib/list'
import { Out } from '../../../lib/out'

declare const USERS: KVNamespace

export class GetUsersInput {
  @IsDefined()
  @IsString({ each: true })
  public ids: string[]
}

export class GetUsersOutput {
  constructor(public users: UserDto[]) {}
}

export async function getUsers(request: Request): Promise<Response> {
  const json = await request.json()
  const input = (await transformAndValidate(GetUsersInput, json)) as GetUsersInput

  const userKeys = map<string, string>(id => getUserKey(id))(input.ids)

  const userVals = await getCachedVals(userKeys, USERS, 'USERS')
  const users = parseVals<IUser>(userVals)
  const userDtos = map<IUser, UserDto>(u => UserDto.from(u))(users)

  return Out.ok(new GetUsersOutput(userDtos))
}
