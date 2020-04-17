import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private data: Configuration;

  get users(): any[] { return this.data.users; }
  get apiUrl(): string { return this.data.apiUrl; }
  get uiUrl(): string { return this.data.uiUrl; }
  get mockData(): boolean { return this.data.mockData; }

  constructor() { }
  setData(data: Configuration) { this.data = data; }
}

export interface Configuration {
  users: any[];
  apiUrl: string;
  uiUrl: string;
  mockData: boolean;
}
