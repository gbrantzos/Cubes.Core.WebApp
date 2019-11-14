import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  private apiUrl = '/ui/lookup/';
  constructor(private http: HttpClient) { }

  public getLookup(lookupName: string): Observable<Lookup> {
    return this.http
      .get<Lookup>(`${this.apiUrl}${lookupName}`);
  }
}

export interface Lookup {
  name: string;
  items: LookupItem[];
}

export interface LookupItem {
  value: string;
  display: string;
  group?: string;
  otherData?: any;
}
