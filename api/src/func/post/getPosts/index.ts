import { transformAndValidate } from 'class-transformer-validator'
import { IsString } from 'class-validator'
import format from 'date-fns/format'
import { map } from 'rambda'

import { KVNamespace } from '@cloudflare/workers-types'

import { getCategoriesPostsKey, getPostIdFromCategoriesPostsKey, getPostKey, IPost, PostDto } from '../../../entity'
import { getCachedVals } from '../../../lib/cache'
import { parseVals } from '../../../lib/list'
import { Out } from '../../../lib/out'

declare const POSTS: KVNamespace
declare const RELATIONS: KVNamespace

export class GetPostsInput {
  @IsString()
  public categoryId: string
}

export class GetPostsOutput {
  constructor(public posts: PostDto[]) {}
}

async function getPostIdsByCategoryId(categoryId: string) {
  const relationKeysRes = await RELATIONS.list({
    prefix: getCategoriesPostsKey(categoryId),
  })
  const postIds = relationKeysRes.keys
    .map(key => getPostIdFromCategoriesPostsKey(key.name))
    .filter(key => key != null) as string[]

  return postIds
}

export async function getPostIds(categoryId: string | undefined | null) {
  if (categoryId) {
    return getPostIdsByCategoryId(categoryId)
  }

  const postKeysRes = await POSTS.list({
    prefix: getPostKey(format(new Date(), 'yyyyLLddHHmm')),
  })
  return postKeysRes.keys.map(k => k.name)
}

export async function getPosts(request: Request): Promise<Response> {
  const json = await request.json()
  const input = (await transformAndValidate(GetPostsInput, json)) as GetPostsInput

  const postIds = await getPostIds(input.categoryId)
  const postKeys = map<string, string>(id => getPostKey(id))(postIds)

  const postVals = await getCachedVals(postKeys, POSTS, 'POSTS')
  const posts = parseVals<IPost>(postVals)
  const postDtos = map<IPost, PostDto>(p => PostDto.from(p))(posts)

  return Out.ok(new GetPostsOutput(postDtos))
}
