import { Gender } from './gender'
import { Role } from './role'

export interface IUser {
  id: string
  emailAddress: string
  name: string
  hash: string
  roles: Role[]
  profile?: {
    gender?: Gender
  }
  meta?: {
    numOfPosts?: number
  }
}

export class UserDto {
  public static from(user: IUser): UserDto {
    return {
      id: user.id,
      name: user.name,
      profile: user.profile,
      meta: user.meta,
    }
  }

  public id: string
  public name: string
  public profile?: ProfileDto
  public meta?: MetaDto
}

export class ProfileDto {
  gender?: Gender
}

export class MetaDto {
  numOfPosts?: number
}

export function getUserKey(id: string) {
  return `id#${id}`
}
