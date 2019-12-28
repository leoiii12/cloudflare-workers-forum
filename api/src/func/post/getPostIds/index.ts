import { transformAndValidate } from 'class-transformer-validator'
import { IsString } from 'class-validator'

import { KVNamespace } from '@cloudflare/workers-types'

import {
  getCategoriesRevDateTimeStrPostsKey,
  getElementsFromCategoriesRevDateTimeStrsPostsKey,
} from '../../../entity'
import { Out } from '../../../lib/out'

declare const RELATIONS: KVNamespace

export class GetPostIdsInput {
  @IsString()
  public categoryId?: string
}

export class GetPostIdsOutput {
  constructor(public postIds: string[]) {}
}

export async function getPostIds(request: Request): Promise<Response> {
  const json = await request.json()
  const input = (await transformAndValidate(
    GetPostIdsInput,
    json,
  )) as GetPostIdsInput

  const postIds = new Set<string>()
  while (true) {
    const relationKeysRes = input.categoryId
      ? await RELATIONS.list({
          prefix: getCategoriesRevDateTimeStrPostsKey(input.categoryId),
        })
      : await RELATIONS.list({
          prefix: getCategoriesRevDateTimeStrPostsKey(),
        })

    for (const key of relationKeysRes.keys.map(k => k.name)) {
      postIds.add(getElementsFromCategoriesRevDateTimeStrsPostsKey(key)!![2])
    }

    if (relationKeysRes.list_complete === true) {
      break
    }
  }

  return Out.ok(new GetPostIdsOutput(Array.from(postIds)))
}
