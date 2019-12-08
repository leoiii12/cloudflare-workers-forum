import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { PopoverController } from '@ionic/angular'

import { DefaultService, PostDto, ReplyDto } from '../../api'
import {
  CreateReplyComponent,
  ICreateReplyComponentProps,
} from '../popovers/create-reply/create-reply.component'

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
    private popoverCtrl: PopoverController,
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

  public async onClickCreateReply(ev: Event) {
    const popover = await this.popoverCtrl.create({
      component: CreateReplyComponent,
      // tslint:disable-next-line: no-object-literal-type-assertion
      componentProps: {
        postId: this.postId,
      } as ICreateReplyComponentProps,
      event: ev,
      translucent: true,
    })

    return popover.present()
  }

  public trackByFn(idx: number, item: { id: string }) {
    return item.id
  }
}
