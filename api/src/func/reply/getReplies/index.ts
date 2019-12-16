import { transformAndValidate } from 'class-transformer-validator'
import { IsDefined, IsDivisibleBy, IsInt, IsString } from 'class-validator'

import { KVNamespace } from '@cloudflare/workers-types'

import { getReplyKey, IPost, IReply, ReplyDto } from '../../../entity'
import { UserFriendlyError } from '../../../err'
import { getCachedEntityVals } from '../../../lib/cache'
import { parseVals } from '../../../lib/list'
import { Out } from '../../../lib/out'

declare const caches: { default: any }

declare const POSTS: KVNamespace
declare const REPLIES: KVNamespace

export class GetRepliesInput {
  @IsDefined()
  @IsString()
  public postId: string

  @IsInt()
  @IsDivisibleBy(20)
  public skip: number
}

export class GetRepliesOutput {
  constructor(public replies: ReplyDto[], public numOfReplies: number) {}
}

export async function getReplies(request: Request): Promise<Response> {
  const json = await request.json()
  const input = (await transformAndValidate(
    GetRepliesInput,
    json,
  )) as GetRepliesInput

  const postVal = await POSTS.get(`id#${input.postId}`)
  if (postVal === null) {
    throw new UserFriendlyError('The post does not exist.')
  }
  const post: IPost = JSON.parse(postVal)
  const postId = post.id

  const replyKeysRes = await REPLIES.list({ prefix: getReplyKey(postId) })
  const replyKeys = replyKeysRes.keys.map(key => key.name)

  const cachedRepliesValRes = (await caches.default.match(
    `https://cache.lecom.cloud/getReplies/${input.postId}/${input.skip}`,
  )) as Response
  if (cachedRepliesValRes !== undefined && cachedRepliesValRes !== null) {
    const cachedRepliesVal = await cachedRepliesValRes.text()
    const cachedReplies = JSON.parse(cachedRepliesVal) as IReply[]
    const cachedReplyDtos = cachedReplies.map(cr => ReplyDto.from(cr))

    return Out.ok(new GetRepliesOutput(cachedReplyDtos, replyKeys.length))
  }

  const subReplyKeys = replyKeys.slice(input.skip, input.skip + 20)

  const replyVals = await getCachedEntityVals(subReplyKeys, REPLIES, 'REPLIES')
  const replies = parseVals<IReply>(replyVals)
  const replyDtos = replies.map(r => ReplyDto.from(r))

  if (replies.length === 20) {
    await caches.default.put(
      `https://cache.lecom.cloud/getReplies/${input.postId}/${input.skip}`,
      new Response(JSON.stringify(replies)),
    )
  }

  return Out.ok(new GetRepliesOutput(replyDtos, replyKeys.length))
}
