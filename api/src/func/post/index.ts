import { IRouteModule } from '../../entity/routeModule'
import { createPost, CreatePostInput, CreatePostOutput } from './createPost'
import { getPost, GetPostInput, GetPostOutput } from './getPost'
import { getPosts, GetPostsInput, GetPostsOutput } from './getPosts'
import {
  getUserPosts,
  GetUserPostsInput,
  GetUserPostsOutput,
} from './getUserPosts'

export const PostModule: IRouteModule = {
  createPost: {
    path: '/post/createPost',
    methods: ['POST'],
    input: CreatePostInput,
    output: CreatePostOutput,
    func: createPost,
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
  getUserPosts: {
    path: '/post/getUserPosts',
    methods: ['POST'],
    input: GetUserPostsInput,
    output: GetUserPostsOutput,
    func: getUserPosts,
  },
}
