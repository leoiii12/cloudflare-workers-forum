export interface IRouteDef {
  name: string
  path: string
  methods: Array<'post' | 'get'>
  inputType: string | undefined
  outputType: string | undefined
}
