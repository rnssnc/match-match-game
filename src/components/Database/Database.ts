export type DatabaseRecord = {
  name: string;
  surname: string;
  email: IDBValidKey;
  avatar: ImageData;
  score: number;
};

export const uniqueFieldName = 'email';

export default class Database {
  public database!: IDBDatabase;

  public storeName: string;

  currentUser!: DatabaseRecord;

  constructor() {
    if (!('indexedDB' in window)) {
      console.warn("This browser doesn't support IndexedDB");
    }
    this.storeName = 'users';
  }

  init(dbName: string, version = 1): Promise<void> {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open(dbName, version);

      openRequest.onsuccess = () => {
        this.database = openRequest.result;

        resolve();
      };

      openRequest.addEventListener('upgradeneeded', () => {
        this.database = openRequest.result;

        const store = this.database.createObjectStore(this.storeName, {
          keyPath: 'email',
        });

        store.createIndex('name', 'name', { unique: false });
        store.createIndex('surname', 'surname', { unique: false });
        store.createIndex('email', 'email', { unique: true });
        store.createIndex('avatar', 'avatar', { unique: false });
        store.createIndex('score', 'score', { unique: false });

        resolve();
      });
    });
  }

  add(dbRecord: DatabaseRecord): Promise<DatabaseRecord> {
    const record = { ...{ score: 0 }, ...dbRecord };

    return new Promise((resolve, reject) => {
      const transaction = this.database.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const result = store.add(record);

      result.onsuccess = () => {
        this.currentUser = record;
        resolve(record);
      };

      result.onerror = (e: Event) => {
        reject(e);
      };

      transaction.onabort = (e: Event) => {
        reject(e);
      };
    });
  }

  readFiltered(
    indexName: string,
    filterFunction?: (recordA: DatabaseRecord) => boolean,
  ): Promise<DatabaseRecord[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.database.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const result = store.index(indexName).openCursor();

      const resultData: DatabaseRecord[] = [];

      result.onsuccess = () => {
        const cursor = result.result;

        if (cursor) {
          if (!filterFunction || filterFunction(cursor.value)) resultData.push(cursor.value);
          cursor.continue();
        }
      };

      result.onerror = (e: Event) => {
        reject(e);
      };

      transaction.oncomplete = () => {
        resolve(resultData);
      };

      transaction.onabort = (e: Event) => {
        reject(e);
      };
    });
  }

  static sortBy(
    records: DatabaseRecord[],
    sortFunction: (a: DatabaseRecord, b: DatabaseRecord) => number,
  ): DatabaseRecord[] {
    return records.sort(sortFunction);
  }

  put(dbRecord: DatabaseRecord): Promise<DatabaseRecord> {
    const record = { ...dbRecord };

    return new Promise((resolve, reject) => {
      const transaction = this.database.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const result = store.put(record);

      result.onsuccess = () => {
        this.currentUser = record;
        resolve(record);
      };

      result.onerror = (e: Event) => {
        reject(e);
      };

      transaction.onabort = (e: Event) => {
        reject(e);
      };
    });
  }
}
