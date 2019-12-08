import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'

import { CreateReplyComponent } from './create-reply/create-reply.component'

@NgModule({
  declarations: [CreateReplyComponent],
  entryComponents: [CreateReplyComponent],
  imports: [CommonModule, IonicModule, FormsModule],
})
export class PopoversModule {}
