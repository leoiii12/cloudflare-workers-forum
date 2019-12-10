import { finalize } from 'rxjs/operators'

import { Component } from '@angular/core'
import { LoadingController, NavParams, PopoverController } from '@ionic/angular'

import { CreatePostInput } from '../../../api'
import { PostService } from '../../post.service'

export interface ICreatePostComponentProps {
  categoryId: string
}

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent {
  public createPostInput: CreatePostInput = {
    title: '',
    paragraphs: [''],
    categoryId: null,
  }

  constructor(
    private navParams: NavParams,
    private popoverCtrl: PopoverController,
    private loadingCtrl: LoadingController,
    private postService: PostService,
  ) {
    this.createPostInput.categoryId = this.navParams.get('categoryId')
  }

  public async onClickPost() {
    const loading = await this.loadingCtrl.create({})
    await loading.present()

    this.postService
      .createPost(this.createPostInput)
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
