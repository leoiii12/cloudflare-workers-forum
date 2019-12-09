import { ValidationError } from 'class-validator'
import getTime from 'date-fns/getTime'

export class Out<T> {
  public static out(status: number, body: any): Response {
    return new Response(JSON.stringify(body), {
      headers: {
        'Access-Control-Allow-Headers': 'Authorization,Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Request-Method': 'OPTIONS,GET,POST',

        'Content-Type': 'application/json',

        'Cache-Control': 'no-cache,no-store,must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      status,
    })
  }

  public static ok(data?: any) {
    const output = new Out()

    if (typeof data === 'string') {
      output.message = data
    } else if (typeof data === 'object') {
      if (data != null) {
        output.data = data
      }
    }

    return this.out(200, output)
  }

  public static internalError(
    message: string = 'There are some errors.',
    data?: any,
  ) {
    const output = new Out()

    output.success = false

    if (message) {
      output.message = message
    }
    if (data) {
      output.data = data
    }

    return this.out(500, output)
  }

  public static error(message: string, data?: any) {
    const output = new Out()

    output.success = false
    output.message = message

    if (data) {
      output.data = data
    }

    return this.out(400, output)
  }

  public static badRequest(validationErrors: ValidationError[]) {
    const output = new Out()

    output.success = false
    output.message = 'The input is invalid.'
    output.data = validationErrors

    return this.out(400, output)
  }

  public static unauthorized() {
    const output = new Out()

    output.success = false

    return this.out(401, output)
  }

  public static notFound() {
    const output = new Out()

    output.success = false

    return this.out(404, output)
  }

  public success: boolean = true

  public data: T

  public message: string

  public dateTime = getTime(new Date())
}
