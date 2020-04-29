import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export enum CoreLookups {
  SchedulerJobTypes = 'Core:SchedulerJobTypes',
  RequestTypes      = 'Core:RequestTypes'
}

interface Cache {
  [name: string]: Observable<Lookup>;
}

@Injectable()
export class LookupService {
  private baseUrl: string;
  private readonly cache: Cache = {};

  constructor(private http: HttpClient, config: ConfigurationService) {
    this.baseUrl = `${config.uiUrl}/lookup/`;
  }

  public getLookup(lookupName: string): Observable<Lookup> {
    const cached = this.cache[lookupName];
    if (cached) {
      return cached;
    } else {
      const actual = this.actualCall(lookupName).pipe(
        map((lookup) => {
          if (lookup.cacheable) {
            this.cache[lookupName] = of(lookup);
          }
          return lookup;
        })
      );
      return actual;
    }
  }

  private actualCall(lookupName: string): Observable<Lookup> {
    return this.http.get<Lookup>(`${this.baseUrl}${lookupName}`).pipe(
      catchError((error, _) => {
        console.error(`Failed to retrieve lookup "${lookupName}"`, error);
        // this.dialogService.snackWarning(`Failed to retrieve schema!\n\n"${name}"\n${error.error}`, 'Close');
        return of(undefined);
      })
    );
  }
}

export interface Lookup {
  name: string;
  items: LookupItem[];
  cacheable: boolean;
}

export interface LookupItem {
  value: string;
  display: string;
  group?: string;
  otherData?: any;
}
