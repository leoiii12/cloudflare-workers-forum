import { Observable } from 'rxjs'

import { Injectable } from '@angular/core'

import { UserDto } from '../api'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public cachedUsers: { [userId: string]: Observable<UserDto> } = {}

  constructor() {}
}
