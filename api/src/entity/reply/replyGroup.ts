import { EntityType } from '../entityType'
import { IReply } from './reply'

export interface IReplyGroup {
  t: EntityType.IReplyGroup
  v: 1

  replies: IReply[]
}

export function getReplyGroupKey(
  postId: string,
  firstMillis: number,
  lastMillis: number,
) {
  return `id#${postId}_${firstMillis}_${lastMillis}`
}
