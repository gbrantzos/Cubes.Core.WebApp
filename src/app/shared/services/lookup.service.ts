import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationService } from '@core/services/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    config: ConfigurationService
  ) { this.baseUrl = `${config.uiUrl}/lookup/`; }

  public getLookup(lookupName: string): Observable<Lookup> {
    return this.http
      .get<Lookup>(`${this.baseUrl}${lookupName}`);
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
