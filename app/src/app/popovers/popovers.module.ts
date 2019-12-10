import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'

import { CreatePostComponent } from './create-post/create-post.component'
import { CreateReplyComponent } from './create-reply/create-reply.component'

@NgModule({
  declarations: [CreateReplyComponent, CreatePostComponent],
  entryComponents: [CreateReplyComponent, CreatePostComponent],
  imports: [CommonModule, IonicModule, FormsModule],
})
export class PopoversModule {}
