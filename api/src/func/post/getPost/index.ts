import { transformAndValidate } from 'class-transformer-validator'
import { IsString } from 'class-validator'

import { KVNamespace } from '@cloudflare/workers-types'

import { getPostKey, PostDto } from '../../../entity'
import { UserFriendlyError } from '../../../err'
import { getCachedVal } from '../../../lib/cache'
import { Out } from '../../../lib/out'

declare const POSTS: KVNamespace

export class GetPostInput {
  @IsString()
  public postId: string
}

export class GetPostOutput {
  constructor(public post: PostDto) {}
}

export async function getPost(request: Request): Promise<Response> {
  const json = await request.json()
  const input = (await transformAndValidate(GetPostInput, json)) as GetPostInput

  const postVal = await getCachedVal(getPostKey(input.postId), POSTS, 'POSTS')
  if (postVal === null) {
    throw new UserFriendlyError('The post does not exist.')
  }
  const post = JSON.parse(postVal) as PostDto
  const postDto = PostDto.from(post)

  return Out.ok(new GetPostOutput(postDto))
}
