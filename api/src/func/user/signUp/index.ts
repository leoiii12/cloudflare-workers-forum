import { genSaltSync, hashSync } from 'bcryptjs'
import { transformAndValidate } from 'class-transformer-validator'
import { IsDefined, IsEmail } from 'class-validator'

import { KVNamespace } from '@cloudflare/workers-types'

import { getUserKey, IUser, Role, UserDto } from '../../../entity'
import { UserFriendlyError } from '../../../err'
import { sha256Encode } from '../../../lib/crypto'
import { Out } from '../../../lib/out'
import { random } from '../../../lib/str'

declare const USERS: KVNamespace

export class SignUpInput {
  @IsDefined()
  @IsEmail()
  public emailAddress: string

  @IsDefined()
  public password: string
}

export class SignUpOutput {
  constructor(public user: UserDto) {}
}

export async function signUp(request: Request): Promise<Response> {
  const json = await request.json()
  const input = (await transformAndValidate(SignUpInput, json)) as SignUpInput

  const existingUser = await USERS.get(`emailAddress#${input.emailAddress}`)
  if (existingUser !== null) {
    throw new UserFriendlyError('The emailAddress is registered.')
  }

  const salt = genSaltSync(8)
  const hash = hashSync(input.password, salt)

  const userId = await sha256Encode(`${input.emailAddress}-${random(8)}`)
  const user: IUser = {
    id: userId,
    emailAddress: input.emailAddress,
    hash,
    role: Role.NormalUsers,
    profile: {},
    meta: {
      numOfPosts: 0,
    },
  }
  await USERS.put(getUserKey(userId), JSON.stringify(user))
  await USERS.put(`emailAddress#${user.emailAddress}`, userId)

  const userVal = await USERS.get(getUserKey(userId))
  if (userVal === null) {
    return Out.internalError('The user does not exist.')
  }
  const userDto = UserDto.from(JSON.parse(userVal))

  return Out.ok(new SignUpOutput(userDto))
}
