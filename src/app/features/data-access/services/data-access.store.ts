import { BehaviorSubject } from 'rxjs';

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
    const temp = [
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

    // Simulate call delay
    setTimeout(() => {
      this.connections$.next(temp);

      const selected = this.connections$.value.find(cnx => cnx.id === selectedConnectionIndex);
      this.selectedConnection$.next(selected);
    }, 4000);
  }

  selectConnection(id: number) {
    const cnx = this.connections$.value.find(i => i.id === id);
    this.selectedConnection$.next({ ...cnx });
  }
}


// ----------------------------------------------------------------------
// DataAccess models
export interface Connection {
  id?: number;
  name: string;
  comments?: string;
  connectionString: string;
  dbProvider: string;
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

