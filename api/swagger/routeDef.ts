export interface IRouteDef {
  name: string
  path: string
  methods: string[]
  inputProperties: Array<{ name: string; decorators: string[]; type: string }>
  outputProperties: Array<{ name: string; decorators: string[]; type: string }>
}
