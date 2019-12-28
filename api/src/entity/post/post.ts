import { EntityType } from '../entityType'

export interface IPost {
  t: EntityType.IPost
  v: 1

  id: string
  title: string
  paragraphs: string[]
  authorUserId: string
  createMillis: number

  categoryId: string
}

export class PostDto {
  public static from(post: IPost): PostDto {
    return {
      id: post.id,
      title: post.title,
      paragraphs: post.paragraphs,
      authorUserId: post.authorUserId,
      createMillis: post.createMillis,
    }
  }

  public id: string
  public title: string
  public paragraphs: string[]
  public authorUserId: string
  public createMillis: number
}

export function getPostKey(dateTimeStrOrId: string, hash?: string) {
  if (hash === undefined) {
    return `id#${dateTimeStrOrId}`
  }

  return `id#${dateTimeStrOrId}_${hash}`
}
