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
   * Tthe replies just posted in this client
   */
  public myPostIdReplies: { [posdId: string]: ReplyDto[] } = {}

  constructor(private defaultService: DefaultService) {}

  public getReplies(postId: string): Observable<ReplyDto[]> {
    return this.defaultService.replyGetRepliesPost({ postId }).pipe(
      map(getRepliesOutput => {
        const replies = (this.postIdReplies[postId] = getRepliesOutput.replies)

        const myReplies = this.myPostIdReplies[postId]
        if (Array.isArray(myReplies)) {
          return replies.concat(myReplies)
        }

        return replies
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

        return createReplyOutput
      }),
    )
  }
}
