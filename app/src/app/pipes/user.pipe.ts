import { map, publishReplay, refCount } from 'rxjs/operators'

import { Pipe, PipeTransform } from '@angular/core'

import { DefaultService, GetUsersOutput, UserDto } from '../../api'
import { UserService } from '../user.service'

@Pipe({
  name: 'user',
})
export class UserPipe implements PipeTransform {
  constructor(
    private defaultService: DefaultService,
    private userService: UserService,
  ) {}

  public transform(userId: string): Promise<UserDto> {
    const cachedUsers = this.userService.cachedUsers

    if (cachedUsers[userId] !== undefined) {
      return cachedUsers[userId].toPromise()
    }

    cachedUsers[userId] = this.defaultService
      .userGetUsersPost({ ids: [userId] })
      .pipe(
        map((getUsersOutput: GetUsersOutput) => {
          return getUsersOutput.users[0]
        }),
        publishReplay(1, 5000),
        refCount(),
      )

    return cachedUsers[userId].toPromise()
  }
}
