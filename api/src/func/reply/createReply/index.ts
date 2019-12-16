import { transformAndValidate } from 'class-transformer-validator'
import { IsDefined, IsString } from 'class-validator'
import format from 'date-fns/format'
import getTime from 'date-fns/getTime'

import { KVNamespace } from '@cloudflare/workers-types'

import {
  EntityType,
  getReplyKey,
  IPost,
  IReply,
  ReplyDto,
} from '../../../entity'
import { InternalServerError, UserFriendlyError } from '../../../err'
import { authorize } from '../../../lib/authorize'
import { Out } from '../../../lib/out'
import { random } from '../../../lib/str'

declare const USERS: KVNamespace
declare const POSTS: KVNamespace
declare const REPLIES: KVNamespace

export class CreateReplyInput {
  @IsDefined()
  @IsString()
  public postId: string

  @IsDefined()
  @IsString()
  public title: string

  @IsDefined()
  @IsString({ each: true })
  public paragraphs: string[]
}

export class CreateReplyOutput {
  constructor(public reply: ReplyDto) {}
}

export async function createReply(request: Request): Promise<Response> {
  const headerAuthorization = request.headers.get('Authorization') || ''
  const { user } = await authorize(headerAuthorization, USERS)

  const json = await request.json()
  const input = (await transformAndValidate(
    CreateReplyInput,
    json,
  )) as CreateReplyInput

  const postVal = await POSTS.get(`id#${input.postId}`)
  if (postVal === null) {
    throw new UserFriendlyError('The post does not exist.')
  }
  const post: IPost = JSON.parse(postVal)

  const createDateTime = new Date()

  const postId = post.id
  const dateTimeStr = format(createDateTime, 'yyyyLLddHHmmssSSS')
  const hash = random(8)
  const replyId = `${postId}_${dateTimeStr}_${hash}`

  const reply: IReply = {
    t: EntityType.IReply,
    v: 1,

    id: replyId,
    authorUserId: user.id,
    title: input.title,
    paragraphs: input.paragraphs,
    createMillis: getTime(createDateTime),
    postId: post.id,
  }

  await REPLIES.put(
    getReplyKey(postId, dateTimeStr, hash),
    JSON.stringify(reply),
  )

  const replyVal = await REPLIES.get(getReplyKey(postId, dateTimeStr, hash))
  if (replyVal === null) {
    throw new InternalServerError('The reply cannot be created.')
  }
  const replyDto = ReplyDto.from(JSON.parse(replyVal))

  return Out.ok(new CreateReplyOutput(replyDto))
}
