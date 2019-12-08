import { map } from 'rambda'

import { KVNamespace } from '@cloudflare/workers-types'

import { CategoryDto, ICategory } from '../../../entity'
import { getCachedVals } from '../../../lib/cache'
import { parseVals } from '../../../lib/list'
import { Out } from '../../../lib/out'

declare const CATEGORIES: KVNamespace

export class GetCategoriesOutput {
  constructor(public categories: CategoryDto[]) {}
}

export async function getCategories(request: Request): Promise<Response> {
  const categoryKeysRes = await CATEGORIES.list({})
  const categoryKeys = map<{ name: string }, string>(k => k.name)(categoryKeysRes.keys)

  const categoryVals = await getCachedVals(categoryKeys, CATEGORIES, 'CATEGORIES')
  const categories = parseVals<ICategory>(categoryVals)
  const categoryDtos = map<ICategory, CategoryDto>(c => CategoryDto.from(c))(categories)

  return Out.ok(new GetCategoriesOutput(categoryDtos))
}
