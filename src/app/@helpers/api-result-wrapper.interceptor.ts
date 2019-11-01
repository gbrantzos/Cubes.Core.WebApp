import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class ApiResultWrapperInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        map(resp => {
          if (resp instanceof HttpResponse) {
            if (isApiResponse(resp.body)) {
              const apiResponse = resp.body as ApiResponse;
              // TODO We should handle hasErrors!
              resp = resp.clone<any>({ body: apiResponse.response });
            }
            return resp;
          }
        })
      );
  }
}


export interface ApiResponse {
  version: string;
  createdAt: Date;
  statusCode: number;
  hasErrors: boolean;
  message?: string;
  response?: any;
}

export function isApiResponse(r: any): r is ApiResponse {
  return ('version' in r) && ('createdAt' in r) && ('hasErrors' in r) && ('statusCode' in r);
}
