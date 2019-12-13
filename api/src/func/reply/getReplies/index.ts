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
  @IsDivisibleBy(40)
  public skip: number
}

export class GetRepliesOutput {
  constructor(public replies: ReplyDto[]) {}
}

export async function getReplies(request: Request): Promise<Response> {
  const json = await request.json()
  const input = (await transformAndValidate(
    GetRepliesInput,
    json,
  )) as GetRepliesInput

  const cachedRepliesValRes = (await caches.default.match(
    `https://cache.lecom.cloud/getReplies/${input.postId}/${input.skip}`,
  )) as Response
  if (cachedRepliesValRes !== undefined && cachedRepliesValRes !== null) {
    const cachedRepliesVal = await cachedRepliesValRes.text()
    const cachedReplies = JSON.parse(cachedRepliesVal) as ReplyDto[]

    return Out.ok(new GetRepliesOutput(cachedReplies))
  }

  const postVal = await POSTS.get(`id#${input.postId}`)
  if (postVal === null) {
    throw new UserFriendlyError('The post does not exist.')
  }
  const post: IPost = JSON.parse(postVal)
  const postId = post.id

  const replyKeysRes = await REPLIES.list({ prefix: getReplyKey(postId) })
  const replyKeys = replyKeysRes.keys.map(key => key.name)

  const subReplyKeys = replyKeys.slice(input.skip, input.skip + 40)

  const replyVals = await getCachedEntityVals(subReplyKeys, REPLIES, 'REPLIES')
  const replies = parseVals<IReply>(replyVals)
  const replyDtos = replies.map(r => ReplyDto.from(r))

  return Out.ok(new GetRepliesOutput(replyDtos))
}
