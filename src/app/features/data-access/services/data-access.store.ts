import { BehaviorSubject, of, Observable } from 'rxjs';
import { DataAccessApiClient } from '@features/data-access/services/data-access.api-client';
import { Injectable } from '@angular/core';
import { tap, flatMap, finalize, map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class DataAccessStore {
  private readonly connections$ = new BehaviorSubject<Connection[]>([]);
  private readonly selectedConnection$ = new BehaviorSubject<Connection>(undefined);

  readonly connections = this.connections$.asObservable();
  readonly selectedConnection = this.selectedConnection$.asObservable();

  private readonly loaderDelay = 500;

  constructor(
    private apiClient: DataAccessApiClient,
    private spinner: NgxSpinnerService
  ) { }

  loadData = () => {
    const call$ = this.apiCallWrapper(
      this.apiClient.loadData(),
      data => {
        this.connections$.next(data.connections);
        this.selectedConnection$.next(undefined);
      }
    );
    call$.subscribe();
  }

  saveData = () => {
    const call$ = this.apiCallWrapper(
      this.apiClient.saveData({
        connections: this.connections$.value,
        queries: []
      })
    );
    call$.subscribe();
  }

  selectConnection(id: number) {
    const cnx = this.connections$.value.find(i => i.id === id);
    this.selectedConnection$.next({ ...cnx });
  }

  addConnection() {
    const nextID = this.nextId();
    const cnx = {
      id: nextID,
      name: `Connection.#${nextID}`,
      comments: 'This is a new connection',
      connectionString: '<<Enter here the connection string>>',
      dbProvider: 'mssql',
      isNew: true
    } as Connection;
    this.selectedConnection$.next(cnx);
  }

  discardNew() { this.selectedConnection$.next(undefined); }

  saveConnection(originalName: string, connection: Connection) {
    if (!connection.id) { connection.id = this.nextId(); }

    const temp = this.connections$
      .value
      .filter(cnx => cnx.name !== originalName);
    const newCnxArray = [
      ...temp,
      connection
    ].sort((a, b) => a.name.localeCompare(b.name));

    this.connections$.next(newCnxArray);
    this.saveData();
  }

  deleteConnection(name: string) {
    const temp = this.connections$
      .value
      .filter(cnx => cnx.name !== name)
      .sort((a, b) => a.name.localeCompare(b.name));

    this.connections$.next(temp);
    this.selectedConnection$.next(undefined);
    this.saveData();
  }

  private nextId = () => Math.max(...this.connections$.value.map(cnx => cnx.id ?? 0)) + 1;

  private apiCallWrapper<T>(
    apiCall: Observable<T>,
    processor: (response: any) => void = null
  ): Observable<T> {
    let callFinished: boolean;
    let loaderVisible: boolean;

    const call$ = of<T>(null)
      .pipe(
        tap(_ => {
          callFinished = false;
          loaderVisible = false;
          // console.log('Starting API call');

          setTimeout(() => {
            if (!callFinished) {
              // console.log('Showing loader');
              this.spinner.show();
              loaderVisible = true;
            }
          }, this.loaderDelay);
        }),
        flatMap(() => apiCall),
        map(data => {
          if (processor) { processor(data); }
          return data;
        }),
        finalize(() => {
          callFinished = true;
          if (loaderVisible) {
            // console.log('Hide loader');
            this.spinner.hide();
          }

          // console.log('API call finished');
        })
      );

    return call$;
  }
}


export interface Connection {
  id?: number;
  name: string;
  comments?: string;
  connectionString: string;
  dbProvider: string;
  isNew?: boolean;
}

export interface Query {
  id?: number;
  name: string;
  comments?: string;
  queryCommand: string;
  parameters?: any[];
}

export interface DataAccessSettings {
  connections: Connection[];
  queries: Query[];
}
