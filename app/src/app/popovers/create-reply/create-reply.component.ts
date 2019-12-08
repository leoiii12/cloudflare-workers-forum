import { CreateReplyInput, DefaultService } from 'src/api'

import { Component } from '@angular/core'
import { NavParams } from '@ionic/angular'

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
  ) {
    this.createReplyInput.postId = this.navParams.get('postId')
  }

  public onClickReply() {
    this.defaultService
      .replyCreateReplyPost(this.createReplyInput)
      .subscribe(createReplyOutput => {
        console.log(createReplyOutput)
      })
  }
}
