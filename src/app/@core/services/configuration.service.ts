import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private data: ConfigurationData;

  get users(): any[] { return this.data.users; }
  get apiUrl(): string { return this.data.apiUrl; }
  get mockData(): boolean { return this.data.mockData; }

  constructor() { }
  setData(data: ConfigurationData) { this.data = data; }
}

export interface ConfigurationData {
  users: any[];
  apiUrl: string;
  mockData: boolean;
}
