import { from } from 'rxjs'

import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { PopoverController } from '@ionic/angular'

import { PostDto, ReplyDto } from '../../api'
import {
  CreateReplyComponent,
  ICreateReplyComponentProps,
} from '../popovers/create-reply/create-reply.component'
import { PostService } from '../post.service'
import { ReplyService } from '../reply.service'

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
    private popoverCtrl: PopoverController,
    private postService: PostService,
    private replyService: ReplyService,
  ) {}

  public ngOnInit() {
    this.postId = this.activatedRoute.snapshot.paramMap.get('postId')

    this.getPost().subscribe(post => (this.post = post))
    this.getReplies().subscribe(replies => (this.replies = replies))
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

    from(popover.onDidDismiss()).subscribe(() => {
      this.getReplies().subscribe(replies => (this.replies = replies))
    })

    return popover.present()
  }

  public async onClickRefresh(ev: Event) {
    this.getReplies().subscribe(replies => (this.replies = replies))
  }

  public trackByFn(idx: number, item: { id: string }) {
    return item.id
  }

  private getPost() {
    return this.postService.getPost(this.postId)
  }

  private getReplies() {
    return this.replyService.getReplies(this.postId)
  }
}
