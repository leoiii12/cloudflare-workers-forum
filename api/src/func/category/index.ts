import { IRouteModule } from '../../entity/routeModule'
import { createCategory, CreateCategoryInput, CreateCategoryOutput } from './createCategory'
import { getCategories, GetCategoriesOutput } from './getCategories'

export const CategoryModule: IRouteModule = {
  createCategory: {
    path: '/category/createCategory',
    methods: ['POST'],
    input: CreateCategoryInput,
    output: CreateCategoryOutput,
    func: createCategory,
  },
  getCategories: {
    path: '/category/getCategories',
    methods: ['POST'],
    input: undefined,
    output: GetCategoriesOutput,
    func: getCategories,
  },
}
