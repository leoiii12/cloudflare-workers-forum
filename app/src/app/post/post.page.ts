import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { DefaultService, PostDto, ReplyDto } from '../../api'

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  public postId: string
  public post: PostDto
  public replies: ReplyDto[]

  constructor(
    private activatedRoute: ActivatedRoute,
    private defaultService: DefaultService,
  ) {}

  public ngOnInit() {
    this.postId = this.activatedRoute.snapshot.paramMap.get('postId')

    this.defaultService
      .postGetPostPost({ postId: this.postId })
      .subscribe(getPostOutput => {
        this.post = getPostOutput.post
      })

    this.defaultService
      .replyGetRepliesPost({ postId: this.postId })
      .subscribe(getRepliesOutput => {
        this.replies = getRepliesOutput.replies
      })
  }

  public trackByFn(idx, item: { id: string }) {
    return item.id
  }
}
