import { KVNamespace } from '@cloudflare/workers-types'

import { CategoryDto, ICategory } from '../../../entity'
import { getCachedEntityVals } from '../../../lib/cache'
import { parseVals } from '../../../lib/list'
import { Out } from '../../../lib/out'

declare const CATEGORIES: KVNamespace

export class GetCategoriesOutput {
  constructor(public categories: CategoryDto[]) {}
}

export async function getCategories(request: Request): Promise<Response> {
  const categoryKeysRes = await CATEGORIES.list({})
  const categoryKeys = categoryKeysRes.keys.map(k => k.name)

  const categoryVals = await getCachedEntityVals(
    categoryKeys,
    CATEGORIES,
    'CATEGORIES',
  )
  const categories = parseVals<ICategory>(categoryVals)
  const categoryDtos = categories.map((c: ICategory) => CategoryDto.from(c))

  return Out.ok(new GetCategoriesOutput(categoryDtos))
}
