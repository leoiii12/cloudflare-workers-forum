import { finalize } from 'rxjs/operators'

import { Component } from '@angular/core'
import { LoadingController, NavParams, PopoverController } from '@ionic/angular'

import { CreateReplyInput } from '../../../api'
import { ReplyService } from '../../reply.service'

export interface ICreateReplyComponentProps {
  postId: string
}

@Component({
  selector: 'app-create-reply',
  templateUrl: './create-reply.component.html',
  styleUrls: ['./create-reply.component.scss'],
})
export class CreateReplyComponent {
  public createReplyInput: CreateReplyInput = {
    postId: '',
    title: '',
    paragraphs: [''],
  }

  constructor(
    private navParams: NavParams,
    private popoverCtrl: PopoverController,
    private loadingCtrl: LoadingController,
    private replyService: ReplyService,
  ) {
    this.createReplyInput.postId = this.navParams.get('postId')
  }

  public async onClickReply() {
    const loading = await this.loadingCtrl.create({})
    await loading.present()

    this.replyService
      .createReply(this.createReplyInput)
      .pipe(
        finalize(async () => {
          await loading.dismiss()
        }),
      )
      .subscribe(async createReplyOutput => {
        await this.popoverCtrl.dismiss(createReplyOutput)
      })
  }
}
