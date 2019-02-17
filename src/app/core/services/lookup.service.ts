import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  private apiUrl = environment.cubesApiUrl + '/ui-lookup/';
  constructor(private http: HttpClient) { }

  public getLookup(lookupName: string): Observable<Lookup> {
    return this.http
      .get(`${this.apiUrl}${lookupName}`)
      .pipe(
        map(res => (<any>res).result)
      );
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
