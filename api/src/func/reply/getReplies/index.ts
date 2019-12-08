import { transformAndValidate } from 'class-transformer-validator'
import { IsDefined, IsString } from 'class-validator'
import { map } from 'rambda'

import { KVNamespace } from '@cloudflare/workers-types'

import { getReplyKey, IPost, IReply, ReplyDto } from '../../../entity'
import { UserFriendlyError } from '../../../err'
import { getCachedVals } from '../../../lib/cache'
import { parseVals } from '../../../lib/list'
import { Out } from '../../../lib/out'

declare const POSTS: KVNamespace
declare const REPLIES: KVNamespace

export class GetRepliesInput {
  @IsDefined()
  @IsString()
  public postId: string
}

export class GetRepliesOutput {
  constructor(public replies: ReplyDto[]) {}
}

export async function getReplies(request: Request): Promise<Response> {
  const json = await request.json()
  const input = (await transformAndValidate(GetRepliesInput, json)) as GetRepliesInput

  const postVal = await POSTS.get(`id#${input.postId}`)
  if (postVal === null) {
    throw new UserFriendlyError('The post does not exist.')
  }
  const post: IPost = JSON.parse(postVal)
  const postId = post.id

  const replyKeysRes = await REPLIES.list({ prefix: getReplyKey(postId) })
  const replyKeys = replyKeysRes.keys.map(key => key.name)

  const replyVals = await getCachedVals(replyKeys, REPLIES, 'REPLIES')
  const replies = parseVals<IReply>(replyVals)
  const replyDtos = map<IReply, ReplyDto>(r => ReplyDto.from(r))(replies)

  return Out.ok(new GetRepliesOutput(replyDtos))
}
