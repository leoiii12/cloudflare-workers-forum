import { transformAndValidate } from 'class-transformer-validator'
import { IsDefined, IsString } from 'class-validator'
import format from 'date-fns/format'
import getTime from 'date-fns/getTime'

import { KVNamespace } from '@cloudflare/workers-types'

import {
  EntityType,
  getCategoriesPostsKey,
  getCategoryKey,
  getPostKey,
  getUsersPostsKey,
  IPost,
  PostDto,
  getCategoriesRevDateTimeStrPostsKey,
} from '../../../entity'
import { InternalServerError, UserFriendlyError } from '../../../err'
import { authorize } from '../../../lib/authorize'
import { Out } from '../../../lib/out'
import { random } from '../../../lib/str'

declare const USERS: KVNamespace
declare const POSTS: KVNamespace
declare const RELATIONS: KVNamespace
declare const CATEGORIES: KVNamespace

export class CreatePostInput {
  @IsDefined()
  @IsString()
  public title: string

  @IsDefined()
  @IsString({ each: true })
  public paragraphs: string[]

  @IsDefined()
  @IsString()
  public categoryId: string
}

export class CreatePostOutput {
  constructor(public post: PostDto) {}
}

export async function createPost(request: Request): Promise<Response> {
  const headerAuthorization = request.headers.get('Authorization') || ''
  const { user } = await authorize(headerAuthorization, USERS)

  const json = await request.json()
  const input = (await transformAndValidate(
    CreatePostInput,
    json,
  )) as CreatePostInput

  const categoryVal = await CATEGORIES.get(getCategoryKey(input.categoryId))
  if (categoryVal === null) {
    throw new UserFriendlyError('The category does not exist.')
  }

  const createDateTime = new Date()

  const dateTimeStr = format(createDateTime, 'yyyyLLddHHmmssSSS')
  const revDateTimeStr =
    '' + (99999999999999 - parseInt(dateTimeStr.substr(0, 14), undefined))
  const hash = random(8)
  const postId = `${dateTimeStr}_${hash}`

  const post: IPost = {
    t: EntityType.IPost,
    v: 1,

    id: postId,
    authorUserId: user.id,
    title: input.title,
    paragraphs: input.paragraphs,
    createMillis: getTime(createDateTime),

    categoryId: input.categoryId,
  }

  await POSTS.put(getPostKey(dateTimeStr, hash), JSON.stringify(post))
  await RELATIONS.put(
    getUsersPostsKey(user.id, postId),
    JSON.stringify({ userId: user.id, postId }),
  )
  await RELATIONS.put(
    getCategoriesRevDateTimeStrPostsKey(
      post.categoryId,
      revDateTimeStr,
      postId,
    ),
    JSON.stringify({ categoryId: post.categoryId, dateTimeStr, postId }),
  )

  const postVal = await POSTS.get(getPostKey(postId))
  if (postVal === null) {
    throw new InternalServerError('The post cannot be created.')
  }
  const postDto = PostDto.from(JSON.parse(postVal))

  return Out.ok(new CreatePostOutput(postDto))
}
