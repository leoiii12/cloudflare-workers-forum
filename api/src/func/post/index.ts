import { IRouteModule } from '../../entity/routeModule'
import { createPost, CreatePostInput, CreatePostOutput } from './createPost'
import { getPost, GetPostInput, GetPostOutput } from './getPost'
import { getPostIds, GetPostIdsInput, GetPostIdsOutput } from './getPostIds'
import { getPosts, GetPostsInput, GetPostsOutput } from './getPosts'

export const PostModule: IRouteModule = {
  createPost: {
    path: '/post/createPost',
    methods: ['POST'],
    input: CreatePostInput,
    output: CreatePostOutput,
    func: createPost,
  },
  getPostIds: {
    path: '/post/getPostIds',
    methods: ['POST'],
    input: GetPostIdsInput,
    output: GetPostIdsOutput,
    func: getPostIds,
  },
  getPost: {
    path: '/post/getPost',
    methods: ['POST'],
    input: GetPostInput,
    output: GetPostOutput,
    func: getPost,
  },
  getPosts: {
    path: '/post/getPosts',
    methods: ['POST'],
    input: GetPostsInput,
    output: GetPostsOutput,
    func: getPosts,
  },
}
