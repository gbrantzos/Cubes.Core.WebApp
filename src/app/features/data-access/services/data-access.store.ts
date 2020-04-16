import { BehaviorSubject, of, Observable } from 'rxjs';
import { DataAccessApiClient } from '@features/data-access/services/data-access.api-client';
import { Injectable } from '@angular/core';
import { tap, flatMap, finalize, map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable()
export class DataAccessStore {
  private readonly connections$ = new BehaviorSubject<Connection[]>([]);
  private readonly selectedConnection$ = new BehaviorSubject<Connection>(undefined);
  private readonly queries$ = new BehaviorSubject<Query[]>([]);
  private readonly selectedQuery$ = new BehaviorSubject<Query>(undefined);

  readonly connections = this.connections$.asObservable();
  readonly selectedConnection = this.selectedConnection$.asObservable();
  readonly queries = this.queries$.asObservable();
  readonly selectedQuery = this.selectedQuery$.asObservable();

  get connectionsValue() { return this.connections$.value.map(c => c.name); }
  get selectedConnectionValue() { return this.selectedConnection$.value?.name; }

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

        this.queries$.next(data.queries);
        this.selectedQuery$.next(undefined);
      }
    );
    call$.subscribe();
  }

  saveData = () => {
    const call$ = this.apiCallWrapper(
      this.apiClient.saveData({
        connections: this.connections$.value,
        queries: this.queries$.value
      })
    );
    call$.subscribe();
  }

  selectConnection(id: number) {
    const cnx = this.connections$.value.find(i => i.id === id);
    this.selectedConnection$.next({ ...cnx });
  }

  newConnection() {
    const nextID = this.nextId('connection');
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

  discardNewConnection() { this.selectedConnection$.next(undefined); }

  selectQuery(id: number) {
    const qry = this.queries$.value.find(q => q.id === id);
    const clone = this.clone(qry);
    this.selectedQuery$.next(clone);
  }

  newQuery() {
    const nextID = this.nextId('query');
    const qry = {
      id: nextID,
      name: `Query.#${nextID}`,
      comments: 'This is a new query',
      queryCommand: 'select * from ...',
      parameters: [],
      isNew: true
    } as Query;
    this.selectedQuery$.next(qry);
  }

  discardNewQuery() { this.selectedQuery$.next(undefined); }

  saveConnection(originalName: string, connection: Connection) {
    if (!connection.id) { connection.id = this.nextId('connection'); }

    const temp = this.connections$
      .value
      .filter(cn => cn.name !== originalName);
    const newCnxArray = [
      ...temp,
      connection
    ].sort((a, b) => a.name.localeCompare(b.name));
    console.log(newCnxArray);
    this.connections$.next(newCnxArray);
    this.saveData();

    const cnx = this.clone(connection) as Connection;
    cnx.isNew = false;
    this.selectedConnection$.next(cnx);
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

  saveQuery(originalName: string, query: Query) {
    if (!query.id) { query.id = this.nextId('query'); }

    const temp = this.queries$
      .value
      .filter(qr => qr.name !== originalName);
    const newQryArray = [
      ...temp,
      query
    ].sort((a, b) => a.name.localeCompare(b.name));

    this.queries$.next(newQryArray);
    this.saveData();

    const qry = this.clone(query) as Query;
    qry.isNew = false;
    this.selectedQuery$.next(qry);
  }

  deleteQuery(name: string) {
    const temp = this.queries$
      .value
      .filter(qry => qry.name !== name)
      .sort((a, b) => a.name.localeCompare(b.name));

    this.queries$.next(temp);
    this.selectedQuery$.next(undefined);
    this.saveData();
  }

  private nextId = (type: 'connection' | 'query') => {
    switch (type) {
      case 'connection':
        return Math.max(...this.connections$.value.map(cnx => cnx.id ?? 0)) + 1;
      case 'query':
        return Math.max(...this.queries$.value.map(qry => qry.id ?? 0)) + 1;
    }
  }

  private clone = (obj: any): any => JSON.parse(JSON.stringify(obj));

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
  isNew?: boolean;
}

export interface DataAccessSettings {
  connections: Connection[];
  queries: Query[];
}
