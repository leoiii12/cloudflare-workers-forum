import { IRouteModule } from '../../entity/routeModule'
import { createReply, CreateReplyInput, CreateReplyOutput } from './createReply'
import { getReplies, GetRepliesInput, GetRepliesOutput } from './getReplies'

export const ReplyModule: IRouteModule = {
  createReply: {
    path: '/reply/createReply',
    methods: ['POST'],
    input: CreateReplyInput,
    output: CreateReplyOutput,
    func: createReply,
  },
  getReplies: {
    path: '/reply/getReplies',
    methods: ['POST'],
    input: GetRepliesInput,
    output: GetRepliesOutput,
    func: getReplies,
  },
}
