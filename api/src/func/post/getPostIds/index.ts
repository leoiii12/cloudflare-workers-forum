import { transformAndValidate } from 'class-transformer-validator'
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator'

import { KVNamespace } from '@cloudflare/workers-types'

import {
  getCategoriesRevDateTimeStrPostsKey,
  getElementsFromCategoriesRevDateTimeStrsPostsKey,
  getElementsFromUsersPostsKey,
  getUserKey,
  getUsersPostsKey,
  IUser,
  ICategory,
  getCategoryKey,
} from '../../../entity'
import { UserFriendlyError } from '../../../err'
import { Out } from '../../../lib/out'

declare const USERS: KVNamespace
declare const RELATIONS: KVNamespace
declare const CATEGORIES: KVNamespace

export class GetPostIdsInput {
  @ValidateIf(i => i.userId === undefined)
  @IsNotEmpty()
  @IsString()
  public categoryId?: string

  @ValidateIf(i => i.categoryId === undefined)
  @IsNotEmpty()
  @IsString()
  public userId?: string
}

export class GetPostIdsOutput {
  constructor(public postIds: string[]) {}
}

async function getPostIdsByUser(
  user: IUser,
): Promise<{ postIds: string[]; cursor: string }> {
  const postIds = new Set<string>()

  for (let i = 0, cursor: string | undefined; i < 45; i++) {
    const relationKeysRes =
      cursor === undefined
        ? await RELATIONS.list({
            prefix: getUsersPostsKey(user.id),
          })
        : await RELATIONS.list({
            cursor,
          })

    for (const key of relationKeysRes.keys.map(k => k.name)) {
      postIds.add(getElementsFromUsersPostsKey(key)!![1])
    }

    cursor = relationKeysRes.cursor
    if (relationKeysRes.list_complete === true) {
      break
    }
  }

  return { postIds: Array.from(postIds), cursor: '' }
}

async function getPostIdsByCategory(category: ICategory) {
  const postIds = new Set<string>()

  for (let i = 0, cursor: string | undefined; i < 45; i++) {
    const relationKeysRes =
      cursor === undefined
        ? await RELATIONS.list({
            prefix: getCategoriesRevDateTimeStrPostsKey(category.id),
          })
        : await RELATIONS.list({
            cursor,
          })

    for (const key of relationKeysRes.keys.map(k => k.name)) {
      postIds.add(getElementsFromCategoriesRevDateTimeStrsPostsKey(key)!![2])
    }

    cursor = relationKeysRes.cursor
    if (relationKeysRes.list_complete === true) {
      break
    }
  }

  return Array.from(postIds)
}

export async function getPostIds(request: Request): Promise<Response> {
  const json = await request.json()
  const input = (await transformAndValidate(
    GetPostIdsInput,
    json,
  )) as GetPostIdsInput

  if (input.categoryId) {
    const categoryVal = await CATEGORIES.get(getCategoryKey(input.categoryId))
    if (categoryVal === null) {
      throw new UserFriendlyError('The category does not exist.')
    }
    const category = JSON.parse(categoryVal) as ICategory

    return Out.ok(new GetPostIdsOutput(await getPostIdsByCategory(category)))
  }
  if (input.userId) {
    const userVal = await USERS.get(getUserKey(input.userId))
    if (userVal === null) {
      throw new UserFriendlyError('The user does not exist.')
    }
    const user = JSON.parse(userVal) as IUser

    return Out.ok(new GetPostIdsOutput(await getPostIdsByUser(user)))
  }

  return Out.ok(new GetPostIdsOutput([]))
}
