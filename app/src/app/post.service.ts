import { LocalStorage } from 'ngx-store'
import { map, flatMap } from 'rxjs/operators'

import { Injectable } from '@angular/core'

import { CreatePostInput, DefaultService, PostDto } from '../api'

@Injectable({
  providedIn: 'root',
})
export class PostService {
  public postIds: string = []
  public posts: PostDto[] = []

  /**
   * The posts just posted in this client,
   * may not shown in the server immediately
   */
  @LocalStorage() public cachedPosts: PostDto[] = []

  constructor(private defaultService: DefaultService) {}

  public getPost(postId: string) {
    return this.defaultService
      .postGetPostPost({ postId })
      .pipe(map(getPostOutput => getPostOutput.post))
  }

  public getPostIds(categoryId: string) {
    if ()
  }

  public getPosts(categoryId: string) {
    return this.defaultService
      .postGetPostIdsPost({ categoryId })
      .pipe(
        flatMap(getPostIdsOutput => {
          return this.defaultService.postGetPostsPost({
            postIds: getPostIdsOutput.postIds,
          })
        }),
      )
      .pipe(
        map(getPostsOutput => {
          const posts = (this.posts = getPostsOutput.posts)
          const hasCachedPosts =
            Array.isArray(this.cachedPosts) && this.cachedPosts.length > 0
          if (hasCachedPosts === false) {
            return posts
          }

          const replyIds = posts.map(r => r.id)
          const cachedPosts = this.cachedPosts.filter(
            r => replyIds.includes(r.id) === false,
          )

          this.cachedPosts = cachedPosts

          return cachedPosts.reverse().concat(posts)
        }),
      )
  }

  public createPost(input: CreatePostInput) {
    return this.defaultService.postCreatePostPost(input).pipe(
      map(createPostOutput => {
        this.cachedPosts.push(createPostOutput.post)

        return createPostOutput
      }),
    )
  }
}
