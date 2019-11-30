export interface IRouteObj {
  path: string
  methods: string[]
  input: any
  output: any
  func: (request: Request) => Promise<Response>
}

export class Input {}
export class Output {}
