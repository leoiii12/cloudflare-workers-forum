import { Observable } from 'rxjs'
import { map, publishReplay, refCount } from 'rxjs/operators'

import { Pipe, PipeTransform } from '@angular/core'

import { DefaultService, GetUsersOutput, UserDto } from '../../api'

@Pipe({
  name: 'user',
})
export class UserPipe implements PipeTransform {
  public cachedUsers: { [userId: string]: Observable<UserDto> } = {}

  constructor(private defaultService: DefaultService) {}

  public transform(userId: string): Promise<UserDto> {
    if (this.cachedUsers[userId] !== undefined) {
      return this.cachedUsers[userId].toPromise()
    }

    this.cachedUsers[userId] = this.defaultService
      .userGetUsersPost({ ids: [userId] })
      .pipe(
        map((getUsersOutput: GetUsersOutput) => {
          return getUsersOutput.users[0]
        }),
        publishReplay(1, 1000),
        refCount(),
      )

    return this.cachedUsers[userId].toPromise()
  }
}
