export interface IReply {
  id: string
  postId: string
  title: string
  paragraphs: string[]
  authorUserId: string
  createMillis: number
}

export class ReplyDto {
  public static from(reply: IReply): ReplyDto {
    return {
      id: reply.id,
      postId: reply.postId,
      title: reply.title,
      paragraphs: reply.paragraphs,
      authorUserId: reply.authorUserId,
      createMillis: reply.createMillis,
    }
  }

  public id: string
  public postId: string
  public title: string
  public paragraphs: string[]
  public authorUserId: string
  public createMillis: number
}

export function getReplyKey(
  postId: string,
  dateTimeStr?: string,
  hash?: string,
) {
  if (dateTimeStr === undefined) {
    return `id#${postId}`
  }

  if (hash === undefined) {
    return `id#${postId}_${dateTimeStr}`
  }

  return `id#${postId}_${dateTimeStr}_${hash}`
}
