import { Injectable } from '@angular/core';
import { DataAccessApiClient } from '@features/data-access/services/data-access.api-client';
import { DialogService } from '@shared/services/dialog.service';
import { LoadingWrapperService } from '@shared/services/loading-wrapper.service';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Class to support all UI related data, for Data Access components
 */
@Injectable()
export class DataAccessStore {
  private readonly connections$ = new BehaviorSubject<Connection[]>([]);
  private readonly selectedConnection$ = new BehaviorSubject<Connection>(undefined);
  private readonly queries$ = new BehaviorSubject<Query[]>([]);
  private readonly selectedQuery$ = new BehaviorSubject<Query>(undefined);

  /** Connections loaded from backend. */
  readonly connections = this.connections$.asObservable();
  /** Connection selected on UI. */
  readonly selectedConnection = this.selectedConnection$.asObservable();
  /** Queries loaded from backend. */
  readonly queries = this.queries$.asObservable();
  /** Query currently selected on UI. */
  readonly selectedQuery = this.selectedQuery$.asObservable();

  get selectedConnectionValue() {
    return this.selectedConnection$.value?.name;
  }

  get connectionsSnapshot() {
    return this.connections$.value;
  }
  get queriesSnapshot() {
    return this.queries$.value;
  }

  constructor(
    private apiClient: DataAccessApiClient,
    private loadingWrapper: LoadingWrapperService,
    private dialog: DialogService
  ) {}

  loadData = () => {
    const call$ = this.loadingWrapper.wrap(this.apiClient.loadData());
    call$.subscribe((data) => {
      this.connections$.next(data.connections);
      this.selectedConnection$.next(undefined);

      this.queries$.next(data.queries);
      this.selectedQuery$.next(undefined);
    });
  }

  saveData = () => {
    const call$ = this.loadingWrapper.wrap(
      this.apiClient.saveData({
        connections: this.connections$.value,
        queries: this.queries$.value,
      })
    );
    call$.subscribe((_) => this.dialog.snackSuccess('Connections and queries saved!'));
  }

  selectConnection(id: number) {
    const cnx = this.connections$.value.find((i) => i.id === id);
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
      isNew: true,
    } as Connection;
    this.selectedConnection$.next(cnx);
  }

  discardNewConnection() {
    this.selectedConnection$.next(undefined);
  }

  selectQuery(id: number) {
    const qry = this.queries$.value.find((q) => q.id === id);
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
      isNew: true,
    } as Query;
    this.selectedQuery$.next(qry);
  }

  discardNewQuery() {
    this.selectedQuery$.next(undefined);
  }

  saveConnection(originalName: string, connection: Connection) {
    if (!connection.id) {
      connection.id = this.nextId('connection');
    }

    const temp = this.connections$.value.filter((cn) => cn.name !== originalName);
    const newCnxArray = [...temp, connection].sort((a, b) => a.name.localeCompare(b.name));

    this.connections$.next(newCnxArray);
    this.saveData();

    const cnx = this.clone(connection) as Connection;
    cnx.isNew = false;
    this.selectedConnection$.next(cnx);
  }

  deleteConnection(name: string) {
    const temp = this.connections$.value
      .filter((cnx) => cnx.name !== name)
      .sort((a, b) => a.name.localeCompare(b.name));

    this.connections$.next(temp);
    this.selectedConnection$.next(undefined);
    this.saveData();
  }

  saveQuery(originalName: string, query: Query) {
    if (!query.id) {
      query.id = this.nextId('query');
    }

    const temp = this.queries$.value.filter((qr) => qr.name !== originalName);
    const newQryArray = [...temp, query].sort((a, b) => a.name.localeCompare(b.name));

    this.queries$.next(newQryArray);
    this.saveData();

    const qry = this.clone(query) as Query;
    qry.isNew = false;
    this.selectedQuery$.next(qry);
  }

  deleteQuery(name: string) {
    const temp = this.queries$.value.filter((qry) => qry.name !== name).sort((a, b) => a.name.localeCompare(b.name));

    this.queries$.next(temp);
    this.selectedQuery$.next(undefined);
    this.saveData();
  }

  defaultQueries(): Observable<string[]> {
    const call$ = this.loadingWrapper.wrap(this.apiClient.getDefaultQueries());
    return call$;
  }

  addDefaultQuery(name: string) {
    const call$ = this.loadingWrapper.wrap(this.apiClient.getDefaultQuery(name));
    call$.subscribe((qry) => {
      const nextID = this.nextId('query');
      qry.id = nextID;
      qry.name = `${qry.name}.#${nextID}`;
      qry.isNew = true;
      this.selectedQuery$.next(qry);
    });
  }

  private nextId = (type: 'connection' | 'query') => {
    switch (type) {
      case 'connection':
        return Math.max(...this.connections$.value.map((cnx) => cnx.id ?? 0)) + 1;
      case 'query':
        return Math.max(...this.queries$.value.map((qry) => qry.id ?? 0)) + 1;
    }
  }

  private clone = (obj: any): any => JSON.parse(JSON.stringify(obj));
}

export interface Connection {
  id?:              number;
  name:             string;
  comments?:        string;
  connectionString: string;
  dbProvider:       string;
  isNew?:           boolean;
}

export interface Query {
  id?:          number;
  name:         string;
  comments?:    string;
  queryCommand: string;
  parameters?:  any[];
  isNew?:       boolean;
  metadata:     QueryMetadata;
  metadataRaw:  string;
}

export interface QueryMetadata {
  fixedColumns: number;
  totalsLabel:  string;
  columns:      QueryMetadataColumn[];
}

export interface QueryMetadataColumn {
  name:      string;
  label:     string;
  format:    string;
  hasTotals: boolean;
}

export interface DataAccessSettings {
  connections: Connection[];
  queries:     Query[];
}
