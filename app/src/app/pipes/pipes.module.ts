import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { UserPipe } from './user.pipe'

@NgModule({
  declarations: [UserPipe],
  exports: [UserPipe],
  imports: [CommonModule],
})
export class PipesModule {}
