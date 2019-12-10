import { transformAndValidate } from 'class-transformer-validator'
import { IsDefined, IsString } from 'class-validator'
import { flatten } from 'rambda'

import { KVNamespace } from '@cloudflare/workers-types'

import {
  EntityType,
  getReplyGroupKey,
  getReplyKey,
  IPost,
  IReply,
  IReplyGroup,
  ReplyDto,
} from '../../../entity'
import { UserFriendlyError } from '../../../err'
import { getCachedVal } from '../../../lib/cache'
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

// TODO
// There should be two requests for consolidation to avoid missing records
// Request 1  -> Combine into a group
// Request 2  -> ReplyGroups -> ConsolidatedIds
//            -> If Replies are in ConsolidatedIds, remove them
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

  const numOfSubrequests = 40

  const replies: IReply[] = []
  const replyGroups: IReply[][] = []
  for (
    let i = 0;
    // replies will be consolidated, it should be count as one subrequest
    i < replyKeys.length && replies.length + i < numOfSubrequests;
    i++
  ) {
    const replyVal = await getCachedVal(replyKeys[i], REPLIES, 'REPLIES')
    if (replyVal === null) {
      continue
    }

    const replyOrReplyGroup = JSON.parse(replyVal) as IReply | IReplyGroup
    if (replyOrReplyGroup.t === EntityType.IReply) {
      replies.push(replyOrReplyGroup)
    } else if (replyOrReplyGroup.t === EntityType.IReplyGroup) {
      replyGroups.push(replyOrReplyGroup.replies)
    }
  }

  // Consolidate replies
  if (replies.length > 3) {
    const firstMillis = replies[0].createMillis
    const lastMillis = replies[replies.length - 1].createMillis

    // Combine into a reply group
    const replyGroupKey = getReplyGroupKey(postId, firstMillis, lastMillis)
    const replyGroup: IReplyGroup = {
      t: EntityType.IReplyGroup,
      v: 1,

      replies,
    }
    await REPLIES.put(replyGroupKey, JSON.stringify(replyGroup))

    // Delete combined records
    for (const replyId of replies.map(r => r.id)) {
      await REPLIES.delete(getReplyKey(replyId))
    }
  }

  const allReplies = flatten([...replyGroups, ...replies]) as IReply[]
  const replyDtos = allReplies.map(r => ReplyDto.from(r))

  return Out.ok(new GetRepliesOutput(replyDtos))
}
