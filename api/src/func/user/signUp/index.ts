import { genSaltSync, hashSync } from 'bcryptjs'
import { transformAndValidate } from 'class-transformer-validator'
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  NotContains,
} from 'class-validator'

import { KVNamespace } from '@cloudflare/workers-types'

import { EntityType, getUserKey, IUser, Role, UserDto } from '../../../entity'
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
  @Length(8)
  public password: string

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @NotContains('#')
  public name: string
}

export class SignUpOutput {
  constructor(public user: UserDto) {}
}

export async function signUp(request: Request): Promise<Response> {
  const json = await request.json()
  const input = (await transformAndValidate(SignUpInput, json)) as SignUpInput

  if (
    (await USERS.get(
      `emailAddress#${await sha256Encode(input.emailAddress)}`,
    )) !== null ||
    (await USERS.get(`name#${await sha256Encode(input.name)}`)) !== null
  ) {
    throw new UserFriendlyError('The emailAddress or name is registered.')
  }

  const salt = genSaltSync(8)
  const hash = hashSync(input.password, salt)

  const userId = await sha256Encode(`${input.emailAddress}-${random(8)}`)
  const user: IUser = {
    t: EntityType.IUser,
    v: 1,

    id: userId,
    emailAddress: input.emailAddress,
    name: input.name,
    hash,
    roles: [Role.NormalUsers],
    profile: {},
    meta: {
      numOfPosts: 0,
    },
  }
  await USERS.put(getUserKey(userId), JSON.stringify(user))
  await USERS.put(
    `emailAddress#${await sha256Encode(user.emailAddress)}`,
    userId,
  )
  await USERS.put(`name#${await sha256Encode(user.name)}`, userId)

  const userVal = await USERS.get(getUserKey(userId))
  if (userVal === null) {
    return Out.internalError('The user does not exist.')
  }
  const userDto = UserDto.from(JSON.parse(userVal))

  return Out.ok(new SignUpOutput(userDto))
}
