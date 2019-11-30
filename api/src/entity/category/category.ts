export interface ICategory {
  id: string
  title: string
  createUserId: string
  status: CategoryStatus
}

export class CategoryDto {
  public static from(category: ICategory): CategoryDto {
    return {
      id: category.id,
      title: category.title,
      createUserId: category.createUserId,
      status: category.status,
    }
  }

  public id: string
  public title: string
  public createUserId: string
  public status: CategoryStatus
}

export enum CategoryStatus {
  Private = 1,
  Public = 2,
}

export function getCategoryKey(categoryId: string) {
  return `id#${categoryId}`
}
