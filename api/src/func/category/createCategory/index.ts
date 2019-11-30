import { transformAndValidate } from 'class-transformer-validator'
import { IsDefined, IsString } from 'class-validator'

import { KVNamespace } from '@cloudflare/workers-types'

import {
  CategoryDto,
  CategoryStatus,
  getCategoryKey,
  ICategory,
} from '../../../entity'
import { InternalServerError, UserFriendlyError } from '../../../err'
import { authorize } from '../../../lib/authorize'
import { sha256Encode } from '../../../lib/crypto'
import { Out } from '../../../lib/out'

declare const USERS: KVNamespace
declare const CATEGORIES: KVNamespace

export class CreateCategoryInput {
  @IsDefined()
  @IsString()
  public title: string
}

export class CreateCategoryOutput {
  constructor(public category: CategoryDto) {}
}

export async function createCategory(request: Request): Promise<Response> {
  const headerAuthorization = request.headers.get('Authorization') || ''
  const { user } = await authorize(headerAuthorization, USERS)

  const text = await request.text()
  const input = (await transformAndValidate(
    CreateCategoryInput,
    text,
  )) as CreateCategoryInput

  const categoryId = await sha256Encode(input.title)
  const existingCategoryVal = await CATEGORIES.get(getCategoryKey(categoryId))
  if (existingCategoryVal !== null) {
    throw new UserFriendlyError('The category is duplicate.')
  }

  const category: ICategory = {
    id: categoryId,
    title: input.title,
    createUserId: user.id,
    status: CategoryStatus.Public,
  }
  await CATEGORIES.put(getCategoryKey(categoryId), JSON.stringify(category))

  const categoryVal = await CATEGORIES.get(getCategoryKey(categoryId))
  if (categoryVal == null) {
    throw new InternalServerError()
  }

  return Out.ok(new CreateCategoryOutput(JSON.parse(categoryVal)))
}
