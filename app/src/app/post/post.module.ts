import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'

import { PipesModule } from '../pipes/pipes.module'
import { PostPageRoutingModule } from './post-routing.module'
import { PostPage } from './post.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostPageRoutingModule,
    PipesModule,
  ],
  declarations: [PostPage],
})
export class PostPageModule {}
