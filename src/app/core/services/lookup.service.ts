import { Injectable } from '@angular/core';
import { Observable, of, empty } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  constructor() { }

  // TODO: Make actual call to backend.
  public getLookup(lookupName: string): Observable<Lookup> {
    if (lookupName === 'jobTypes') {
      const jobTypeLookup: Lookup = {
        name: 'jobTypes',
        items: [
          {
            id: 'Cubes.Core.Jobs.ExecuteCommand',
            display: 'Execute Command'
          }
        ]
      };
      return of(jobTypeLookup);
    }

    if (lookupName === 'commandTypes') {
      const commandTypeLookup: Lookup = {
        name: 'commandTypes',
        items: [
          {
            id: 'Cubes.Core.Commands.RunOsProcessCommand',
            display: 'Run OS process'
          },
          {
            id: 'Cubes.Core.Commands.SqlResultsAsEmail',
            display: 'Execute SQL and send results as e-mail'
          }
        ]
      };
      return of(commandTypeLookup);
    }

    return empty();
  }
}

export interface Lookup {
  name: string;
  items: LookupItem[];
}

export interface LookupItem {
  id: string;
  display: string;
  group?: string;
  otherData?: any;
}
