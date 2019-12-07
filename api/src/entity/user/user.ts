import { Gender } from './gender'
import { Role } from './role'

export interface IUser {
  id: string
  emailAddress: string
  hash: string
  role: Role
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
      profile: user.profile,
      meta: user.meta,
    }
  }

  public id: string
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
