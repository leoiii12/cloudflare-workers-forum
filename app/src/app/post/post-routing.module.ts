import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { PostPage } from './post.page'

const routes: Routes = [
  {
    path: '',
    component: PostPage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostPageRoutingModule {}
