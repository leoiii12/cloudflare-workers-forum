import { transformAndValidate } from 'class-transformer-validator'
import { IsDefined, IsString } from 'class-validator'

import { KVNamespace } from '@cloudflare/workers-types'

import {
  getPostIdFromUsersPostsKey,
  getUserKey,
  getUsersPostsKey,
  IPost,
  IUser,
  PostDto,
  getPostKey,
} from '../../../entity'
import { UserFriendlyError } from '../../../err'
import { getCachedVals } from '../../../lib/cache'
import { parseVals } from '../../../lib/list'
import { Out } from '../../../lib/out'

declare const USERS: KVNamespace
declare const POSTS: KVNamespace
declare const RELATIONS: KVNamespace

export class GetUserPostsInput {
  @IsDefined()
  @IsString()
  public userId: string
}

export class GetUserPostsOutput {
  constructor(public posts: PostDto[]) {}
}

async function getPostIdsByUser(userId: string) {
  const userVal = await USERS.get(getUserKey(userId))
  if (userVal === null) {
    throw new UserFriendlyError('The user does not exist.')
  }
  const user = JSON.parse(userVal) as IUser

  const relationKeysRes = await RELATIONS.list({
    prefix: getUsersPostsKey(user.id),
  })
  const postIds = relationKeysRes.keys
    .map(key => getPostIdFromUsersPostsKey(key.name))
    .filter(key => key) as string[]

  return postIds
}

export async function getUserPosts(request: Request): Promise<Response> {
  const json = await request.json()
  const input = (await transformAndValidate(
    GetUserPostsInput,
    json,
  )) as GetUserPostsInput

  const postIds = await getPostIdsByUser(input.userId)
  const postKeys = postIds.map(id => getPostKey(id))

  const postVals = await getCachedVals(postKeys, POSTS, 'POSTS')
  const posts = parseVals<IPost>(postVals)
  const postDtos = posts.map(p => PostDto.from(p))

  return Out.ok(new GetUserPostsOutput(postDtos))
}
