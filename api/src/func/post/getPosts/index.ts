import { transformAndValidate } from 'class-transformer-validator'
import { IsArray, MaxLength, Length } from 'class-validator'

import { KVNamespace } from '@cloudflare/workers-types'

import { IPost, PostDto, getPostKey } from '../../../entity'
import { getCachedEntityVals } from '../../../lib/cache'
import { parseVals } from '../../../lib/list'
import { Out } from '../../../lib/out'

declare const POSTS: KVNamespace

export class GetPostsInput {
  @IsArray()
  @Length(26, 26, { each: true })
  public postIds: string[]
}

export class GetPostsOutput {
  constructor(public posts: PostDto[]) {}
}

export async function getPosts(request: Request): Promise<Response> {
  const json = await request.json()
  const input = (await transformAndValidate(
    GetPostsInput,
    json,
  )) as GetPostsInput

  const postIds = input.postIds
  const postKeys = postIds.map(id => getPostKey(id))

  const postVals = await getCachedEntityVals(postKeys, POSTS, 'POSTS')
  const posts = parseVals<IPost>(postVals)
  const postDtos = posts.map(p => PostDto.from(p))

  return Out.ok(new GetPostsOutput(postDtos))
}
