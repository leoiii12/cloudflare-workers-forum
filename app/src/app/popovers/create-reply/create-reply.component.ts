import { CreateReplyInput, DefaultService } from 'src/api'

import { Component } from '@angular/core'
import { NavParams, PopoverController, LoadingController } from '@ionic/angular'
import { finalize } from 'rxjs/operators'

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
    private defaultService: DefaultService,
    private navParams: NavParams,
    private popoverCtrl: PopoverController,
    private loadingCtrl: LoadingController,
  ) {
    this.createReplyInput.postId = this.navParams.get('postId')
  }

  public async onClickReply() {
    const loading = await this.loadingCtrl.create({})
    await loading.present()

    this.defaultService
      .replyCreateReplyPost(this.createReplyInput)
      .pipe(
        finalize(async () => {
          await loading.dismiss()
        }),
      )
      .subscribe(async createReplyOutput => {
        await this.popoverCtrl.dismiss()
      })
  }
}
