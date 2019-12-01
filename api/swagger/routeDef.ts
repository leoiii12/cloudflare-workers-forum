import { IPropertyDef } from './propertyDef'

export interface IRouteDef {
  name: string
  path: string
  methods: string[]
  inputProperties: IPropertyDef[]
  outputProperties: IPropertyDef[]
}
