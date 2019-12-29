import { LocalStorage } from 'ngx-store'
import { map, flatMap } from 'rxjs/operators'

import { Injectable } from '@angular/core'

import { CreatePostInput, DefaultService, PostDto } from '../api'

@Injectable({
  providedIn: 'root',
})
export class PostService {
  public posts: PostDto[] = []

  /**
   * The posts just posted in this client,
   * may not shown in the server immediately
   */
  @LocalStorage() public myPosts: PostDto[] = []

  constructor(private defaultService: DefaultService) {}

  public getPost(postId: string) {
    return this.defaultService
      .postGetPostPost({ postId })
      .pipe(map(getPostOutput => getPostOutput.post))
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
            Array.isArray(this.myPosts) && this.myPosts.length > 0
          if (hasCachedPosts === false) {
            return posts
          }

          const replyIds = posts.map(r => r.id)
          const myPosts = this.myPosts.filter(
            r => replyIds.includes(r.id) === false,
          )

          this.myPosts = myPosts

          return myPosts.concat(posts)
        }),
      )
  }

  public createPost(input: CreatePostInput) {
    return this.defaultService.postCreatePostPost(input).pipe(
      map(createPostOutput => {
        this.myPosts.push(createPostOutput.post)

        return createPostOutput
      }),
    )
  }
}
