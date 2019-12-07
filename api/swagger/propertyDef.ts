export interface IPropertyDef {
  t: 'IPropertyDef'

  name: string
  decorators: string[]
  type: string
  arrayDepth: number
  isNullableOrUndefined: boolean
}
