import { BehaviorSubject } from 'rxjs';

const initial = [
  {
    id: 1,
    name: 'Sample.Connection',
    comments: 'Sample connection',
    connectionString: 'Connection string',
    dbProvider: 'mssql'
  },
  {
    id: 2,
    name: 'Sample.Connection.#2',
    comments: 'Second sample connection',
    connectionString: 'Connection string',
    dbProvider: 'oracle'
  }
];

export class DataAccessStore {
  private readonly connections$ = new BehaviorSubject<Connection[]>([]);
  private readonly selectedConnection$ = new BehaviorSubject<Connection>(undefined);

  readonly connections = this.connections$.asObservable();
  readonly selectedConnection = this.selectedConnection$.asObservable();

  constructor() { }
  load = () => {
    const selectedConnectionIndex = this.selectedConnection$?.value?.id ?? 0;

    console.log('Loading connections...');
    // TODO Actual api call OR service call!

    // Simulate call delay
    setTimeout(() => {
      this.connections$.next(initial);

      const selected = this.connections$.value.find(cnx => cnx.id === selectedConnectionIndex);
      this.selectedConnection$.next(selected);
    }, 400);
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
  }

  deleteConnection(name: string) {
    const temp = this.connections$
      .value
      .filter(cnx => cnx.name !== name)
      .sort((a, b) => a.name.localeCompare(b.name));

    this.connections$.next(temp);
    this.selectedConnection$.next(undefined);
  }

  private nextId = () => Math.max(...this.connections$.value.map(cnx => cnx.id ?? 0));
}


// ----------------------------------------------------------------------
// DataAccess models
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
// ----------------------------------------------------------------------

