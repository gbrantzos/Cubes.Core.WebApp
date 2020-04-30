import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CubesApiResultInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((resp) => {
        if (resp instanceof HttpResponse) {
          if (isApiResponse(resp.body)) {
            const apiResponse = resp.body as CubesApiResponse;
            if (apiResponse.hasErrors) {
              throw new Error(apiResponse.message);
            }
            resp = resp.clone<any>({ body: apiResponse.response });
          }
          return resp;
        }
      })
    );
  }
}

// prettier-ignore
export interface CubesApiResponse {
  version:    string;
  createdAt:  Date;
  statusCode: number;
  hasErrors:  boolean;
  message?:   string;
  response?:  any;
}

export function isApiResponse(r: any): r is CubesApiResponse {
  return r
    && typeof r === 'object'
    && ('version' in r)
    && ('createdAt' in r)
    && ('hasErrors' in r)
    && ('statusCode' in r);
}
