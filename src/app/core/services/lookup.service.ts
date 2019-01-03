import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  constructor() { }

  public getJobTypeLookup(): Observable<Lookup> {
    // TODO: Make actual call to backend.
    const jobTypeLookup: Lookup = {
      name: 'jobTypeLookup',
      items: [
        {
          id: 'Cubes.Core.Jobs.ExecuteCommand',
          display: 'Execute Command'
        }
      ]
    };

    const jobTypeLookup$ = of(jobTypeLookup);
    return jobTypeLookup$;
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
