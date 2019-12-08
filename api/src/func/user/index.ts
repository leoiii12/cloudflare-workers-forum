import { IRouteModule } from '../../entity/routeModule'
import { authorize, AuthorizeInput, AuthorizeOutput } from './authorize'
import { getUsers, GetUsersInput, GetUsersOutput } from './getUsers'
import { signUp, SignUpInput, SignUpOutput } from './signUp'
import { updateUser, UpdateUserInput } from './updateUser'

export const UserModule: IRouteModule = {
  authorize: {
    path: '/user/authorize',
    methods: ['POST'],
    input: AuthorizeInput,
    output: AuthorizeOutput,
    func: authorize,
  },
  getUsers: {
    path: '/user/getUsers',
    methods: ['POST'],
    input: GetUsersInput,
    output: GetUsersOutput,
    func: getUsers,
  },
  signUp: {
    path: '/user/signUp',
    methods: ['POST'],
    input: SignUpInput,
    output: SignUpOutput,
    func: signUp,
  },
  updateUser: {
    path: '/user/updateUser',
    methods: ['POST'],
    input: UpdateUserInput,
    output: undefined,
    func: updateUser,
  },
}
