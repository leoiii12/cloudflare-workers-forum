import { compareSync } from 'bcryptjs'
import { transformAndValidate } from 'class-transformer-validator'
import { IsDefined, IsEmail } from 'class-validator'

import { KVNamespace } from '@cloudflare/workers-types'

import { getUserKey, IUser } from '../../../entity'
import { InternalServerError, UnauthorizedError } from '../../../err'
import { sha256Encode } from '../../../lib/crypto'
import { signJwt } from '../../../lib/jwt'
import { Out } from '../../../lib/out'

declare const USERS: KVNamespace

export class AuthorizeInput {
  @IsDefined()
  @IsEmail()
  public emailAddress: string

  @IsDefined()
  public password: string
}

export class AuthorizeOutput {
  constructor(public jwt: string) {}
}

export async function authorize(request: Request): Promise<Response> {
  const json = await request.json()
  const input = (await transformAndValidate(
    AuthorizeInput,
    json,
  )) as AuthorizeInput

  const id = await USERS.get(
    `emailAddress#${await sha256Encode(input.emailAddress)}`,
  )
  if (id === null) {
    throw new UnauthorizedError()
  }

  const userVal = await USERS.get(getUserKey(id))
  if (userVal === null) {
    return Out.internalError('The user does not exist.')
  }
  const user: IUser = JSON.parse(userVal)

  if (compareSync(input.password, user.hash) === false) {
    throw new UnauthorizedError()
  }

  const jwt = await signJwt({ id }, 'TBR')
  if (jwt === null) {
    throw new InternalServerError()
  }

  return Out.ok(new AuthorizeOutput(jwt))
}
