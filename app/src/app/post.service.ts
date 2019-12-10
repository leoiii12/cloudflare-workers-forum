import { LocalStorage } from 'ngx-store'

import { Injectable } from '@angular/core'

import { DefaultService, PostDto } from '../api'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class PostService {
  public posts: PostDto[] = []

  /**
   * The replies just posted in this client,
   * may not shown in the server immediately
   */
  @LocalStorage() public myPosts: PostDto[] = []

  constructor(private defaultService: DefaultService) {}

  public getPosts(categoryId: string) {
    return this.defaultService
      .postGetPostsPost({
        categoryId,
      })
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

          return posts.concat(myPosts)
        }),
      )
  }
}
