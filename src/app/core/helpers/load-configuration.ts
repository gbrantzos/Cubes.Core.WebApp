import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConfigurationService } from '@core/services/configuration.service';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export function loadConfiguration(http: HttpClient, configuration: ConfigurationService): () => Promise<boolean> {
  return (): Promise<boolean> => {
    // Development configuration
    const configDevelopment$ = http.get('assets/config.json').pipe(
      catchError(
        (x: HttpErrorResponse, _): Observable<any> => {
          console.error('Development config file not found on assets folder!', x.status, x.statusText);
          return of({});
        }
      )
    );

    // Production configuration
    const configProduction$ =
      environment.production === false
        ? of({})
        : http.get('assets/config.prod.json').pipe(
            catchError(
              (x: HttpErrorResponse, _): Observable<any> => {
                console.error('Production config file not found on assets folder!', x.status, x.statusText);
                return of({});
              }
            )
          );

    return new Promise<boolean>((resolve: (a: boolean) => void): void => {
      forkJoin(configDevelopment$, configProduction$)
        .pipe(
          delay(environment.production ? 500 : 100),
          map(([configLocal, configProd]) => {
            configuration.setData({ ...configLocal, ...configProd });
            resolve(true);
          }),
          catchError(
            (x: HttpErrorResponse, _): Observable<any> => {
              console.error('Failed to read configuration!', x.status, x.statusText);
              return of({});
            }
          )
        )
        .subscribe();
    });
  };
}
