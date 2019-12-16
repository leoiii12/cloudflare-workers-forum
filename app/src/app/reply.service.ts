import { LocalStorage } from 'ngx-store'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { Injectable } from '@angular/core'

import {
  CreateReplyInput,
  CreateReplyOutput,
  DefaultService,
  ReplyDto,
} from '../api'

@Injectable({
  providedIn: 'root',
})
export class ReplyService {
  /**
   * This is the latest server version,
   * but the server database is eventual consistent.
   *
   * This may not include the replies just posted by the current user.
   */
  public postIdReplies: { [postId: string]: ReplyDto[] } = {}

  /**
   * The replies just posted in this client,
   * may not shown in the server immediately
   */
  @LocalStorage() public myPostIdReplies: { [posdId: string]: ReplyDto[] } = {}

  constructor(private defaultService: DefaultService) {}

  public getReplies(postId: string, skip: number): Observable<ReplyDto[]> {
    return this.defaultService.replyGetRepliesPost({ postId, skip }).pipe(
      map(getRepliesOutput => {
        const replies = (this.postIdReplies[postId] = getRepliesOutput.replies)
        const hasCachedReplies =
          Array.isArray(this.myPostIdReplies[postId]) &&
          this.myPostIdReplies[postId].length > 0
        if (hasCachedReplies === false) {
          return replies
        }

        const replyIds = replies.map(r => r.id)
        const myReplies = this.myPostIdReplies[postId].filter(
          r => replyIds.includes(r.id) === false,
        )

        this.myPostIdReplies[postId] = myReplies
        ;(this.myPostIdReplies as any).save()

        return replies.concat(myReplies)
      }),
    )
  }

  public createReply(
    createReplyInput: CreateReplyInput,
  ): Observable<CreateReplyOutput> {
    return this.defaultService.replyCreateReplyPost(createReplyInput).pipe(
      map(createReplyOutput => {
        if (
          Array.isArray(this.myPostIdReplies[createReplyInput.postId]) === true
        ) {
          this.myPostIdReplies[createReplyInput.postId].push(
            createReplyOutput.reply,
          )
        } else {
          this.myPostIdReplies[createReplyInput.postId] = [
            createReplyOutput.reply,
          ]
        }
        ;(this.myPostIdReplies as any).save()

        return createReplyOutput
      }),
    )
  }
}
