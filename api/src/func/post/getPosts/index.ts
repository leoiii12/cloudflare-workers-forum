import { transformAndValidate } from 'class-transformer-validator'
import { IsString, MinLength, ValidateIf } from 'class-validator'

import { KVNamespace } from '@cloudflare/workers-types'

import { IPost, PostDto, getPostKey } from '../../../entity'
import { getCachedEntityVals } from '../../../lib/cache'
import { parseVals } from '../../../lib/list'
import { Out } from '../../../lib/out'
import { GetPostIdsOutput } from '../getPostIds'

declare const POSTS: KVNamespace

export class GetPostsInput {
  @IsString()
  @MinLength(10)
  public categoryId?: string
}

export class GetPostsOutput {
  constructor(public posts: PostDto[], public numOfPosts: number) {}
}

export async function getPostIds(categoryId: string | undefined | null) {
  if (categoryId) {
    const getPostIdsRes = await fetch(
      'https://forum-api.lecom.cloud/post/getPostIds',
      {
        method: 'POST',
        body: JSON.stringify({
          categoryId:
            '31d8d48a7adaae3234afe59d5c702c90144cb5fde976567a9f50ce601b2a9227',
        }),
      },
    )

    return (await getPostIdsRes.json()) as Out<GetPostIdsOutput>
  }

  const getPostIdsRes = await fetch(
    'https://forum-api.lecom.cloud/post/getPostIds',
    {
      method: 'POST',
    },
  )

  return (await getPostIdsRes.json()) as Out<GetPostIdsOutput>
}

export async function getPosts(request: Request): Promise<Response> {
  const json = await request.json()
  const input = (await transformAndValidate(
    GetPostsInput,
    json,
  )) as GetPostsInput

  const postIdsRes = await getPostIds(input.categoryId)
  const postIds = postIdsRes.data.postIds
  const postKeys = postIds.map(id => getPostKey(id))

  const postVals = await getCachedEntityVals(postKeys, POSTS, 'POSTS')
  const posts = parseVals<IPost>(postVals)
  const postDtos = posts.map(p => PostDto.from(p))

  return Out.ok(new GetPostsOutput(postDtos, postIds.length))
}
