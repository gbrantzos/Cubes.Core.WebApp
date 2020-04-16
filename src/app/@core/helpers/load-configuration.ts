import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConfigurationService } from '@core/services/configuration.service';
import { map, catchError, delay } from 'rxjs/operators';
import { of, Observable, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';

export function loadConfiguration(http: HttpClient, configuration: ConfigurationService): (() => Promise<boolean>) {
  return (): Promise<boolean> => {

    // Development configuration
    const configDevelopment$ = http
      .get('assets/config.json')
      .pipe(
        delay(300),
        catchError((x: HttpErrorResponse, _): Observable<any> => {
          console.error('Development config file not found on assets folder!', x.status, x.statusText);
          return of({});
        })
      );

    // Production configuration
    const configProduction$ = environment.production === false ?
      of({}) :
      http
        .get('assets/config.prod.json')
        .pipe(
          catchError((x: HttpErrorResponse, _): Observable<any> => {
            console.error('Production config file not found on assets folder!', x.status, x.statusText);
            return of({});
          })
        );

    return new Promise<boolean>((resolve: (a: boolean) => void): void => {
      forkJoin(configDevelopment$, configProduction$)
        .pipe(
          delay(1200),
          map(([configLocal, configProd]) => {
            configuration.setData({ ...configLocal, ...configProd });
            resolve(true);
          }),
          catchError((x: HttpErrorResponse, _): Observable<any> => {
            console.error('Failed to read configuration!', x.status, x.statusText);
            return of({});
          })
        )
        .subscribe();
    });
  };
}
