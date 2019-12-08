import { pipe, Subject } from 'rxjs'
import { map } from 'rxjs/operators'

import { Pipe, PipeTransform } from '@angular/core'

import { DefaultService, GetUsersOutput, UserDto } from '../api'

@Pipe({
  name: 'userPipe',
})
export class UserPipePipe implements PipeTransform {
  public cachedUsers: { [userId: string]: UserDto } = {}

  constructor(private defaultService: DefaultService) {}

  public transform(userId: string): Promise<UserDto> {
    if (this.cachedUsers[userId] !== undefined) {
      return new Promise(() => {
        return this.cachedUsers[userId]
      })
    }

    return this.defaultService
      .userGetUsersPost({ ids: [userId] })
      .pipe(
        map((getUsersOutput: GetUsersOutput) => {
          for (const user of getUsersOutput.users) {
            this.cachedUsers[userId] = user
          }

          return this.cachedUsers[userId]
        }),
      )
      .toPromise()
  }
}
