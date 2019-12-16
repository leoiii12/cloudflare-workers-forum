import { from } from 'rxjs'

import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { PopoverController } from '@ionic/angular'

import { map } from 'rxjs/operators'
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
  public replyKeys: Set<string> = new Set()
  public skip: number = 0

  public pageControls = {
    hasMoreReplies: true,
  }

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

  public onInfinite(ev: any) {
    this.getReplies().subscribe(replies => (this.replies = replies))
    ev.target.complete()
  }

  public trackByFn(idx: number, item: { id: string }) {
    return item.id
  }

  private getPost() {
    return this.postService.getPost(this.postId)
  }

  private getReplies() {
    const existingReplies = this.replies || []

    return this.replyService
      .getReplies(this.postId, Math.floor(existingReplies.length / 20) * 20)
      .pipe(
        map(replies => {
          this.pageControls.hasMoreReplies = replies.length >= 20

          return replies
        }),
        map(replies => {
          return replies.filter(r => this.replyKeys.has(r.id) === false)
        }),
        map(replies => {
          replies.forEach(r => this.replyKeys.add(r.id))

          if (existingReplies.length === 0) {
            return replies
          }
          return existingReplies.concat(replies)
        }),
      )
  }
}
