import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private data: Configuration;

  get users(): any[] {
    return this.data.users;
  }
  get apiUrl(): string {
    return this.data.apiUrl;
  }
  get uiUrl(): string {
    return this.data.uiUrl;
  }
  get baseUrl(): string {
    return this.data.baseUrl;
  }
  get mockData(): boolean {
    return this.data.mockData;
  }
  get sideNavItems(): SideNavItem[] {
    return sideNavItems;
  }

  constructor() {}
  setData(data: Configuration) {
    this.data = data;
  }
}

export interface Configuration {
  users: any[];
  apiUrl: string;
  uiUrl: string;
  baseUrl: string;
  mockData: boolean;
}

export interface SideNavItem {
  label: string;
  icon: string;
  link: string;
}
const sideNavItems = [
  {
    label: 'Home',
    icon: 'fa-home',
    link: '/home',
  },
  {
    label: 'Scheduler',
    icon: 'fa-calendar-alt',
    link: '/scheduler',
  },
  {
    label: 'Data Access',
    icon: 'fa-database',
    link: '/data',
  },
  {
    label: 'Settings',
    icon: 'fa-sliders-h',
    link: '/settings',
  },
  {
    label: 'Security',
    icon: 'fa-user-lock',
    link: '/security'
  },
  {
    label: 'About',
    icon: 'fa-question-circle',
    link: '/about',
  },
];
