import { LocalStorage } from 'ngx-store'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable()
export class DataInterceptor implements HttpInterceptor {
  @LocalStorage() jwt: string

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let tokenizedReq = req.clone({
      setHeaders: {
        'X-Authorization': 'Bearer ' + this.jwt,
      },
    })

    return next.handle(this.jwt ? tokenizedReq : req).pipe(
      map((event: any) => {
        if (event instanceof HttpResponse) {
          if (event.body) {
            if (event.body.data) {
              if (event.body.data.jwt) {
                this.jwt = event.body.data.jwt
              }

              return event.clone({ body: event.body.data })
            }
          }
        }

        return event
      }),
    )
  }
}
