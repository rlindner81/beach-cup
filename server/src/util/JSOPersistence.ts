import { exists } from "https://deno.land/std@0.71.0/fs/mod.ts";

/**
await store.initialize();
const name = store.create("./names", { givenName: "richard", familyName: "lindner" });
if (name !== null) {
  const allNames = store.read("./names");
  const myName = store.readFirst("./names", { id: name.id });
  const updateCount = store.update("./names", { givenName: "valentin" }, { id: name.id });
  const changedNames = store.read("./names", { id: name.id });
  const deleteCount = store.delete("./names", { id: name.id });
  const noNames = store.read("./names", { id: name.id });
  const i = 0;
}
*/

type JSOStoreBase = string | number | boolean;
type JSOStoreRecord = Record<string, JSOStoreBase>;
type JSOStoreWhere = Record<string, JSOStoreBase>;
type JSOStore = Record<string, Array<JSOStoreRecord>>;

const JSOPersistence = (
  filepath = "./store.json",
  pollTimeout = 1000,
) => {
  let _store: JSOStore = Object.create(null);
  let _pollingId: number | null = null;

  const _flush = async (): Promise<void> =>
    Deno.writeTextFile(filepath, JSON.stringify(_store, null, 2) + "\n");
  const _unflush = async (): Promise<void> => {
    if (await exists(filepath)) {
      _store = JSON.parse(await Deno.readTextFile(filepath));
    }
  };

  const _access = (
    path: string,
  ): Array<JSOStoreRecord> | null => {
    if (_pollingId === null) {
      return null;
    }
    if (!Object.prototype.hasOwnProperty.call(_store, path)) {
      _store[path] = [];
    }
    return _store[path];
  };
  const _filter = (
    where: JSOStoreWhere,
  ) =>
    (record: JSOStoreRecord) => {
      for (const [key, value] of Object.entries(where)) {
        if (record[key] !== value) {
          return false;
        }
      }
      return true;
    };

  const initialize = async (): Promise<void> => {
    await _unflush();
    _pollingId = setInterval(async () => _flush(), pollTimeout);
  };

  const create = (
    path: string,
    payload: JSOStoreRecord,
  ): JSOStoreRecord | null => {
    const records = _access(path);
    if (records === null) {
      return null;
    }
    if (!Object.prototype.hasOwnProperty.call(_store, path)) {
      _store[path] = [];
    }
    const newRecord = Object.prototype.hasOwnProperty.call(payload, "id")
      ? { ...payload }
      : { id: records.length + 1, ...payload };
    records.push(newRecord);
    return newRecord;
  };

  const read = (
    path: string,
    where?: JSOStoreWhere,
  ): Array<JSOStoreRecord> | null => {
    const records = _access(path);
    if (records === null) {
      return null;
    }
    return where ? records.filter(_filter(where)) : records.slice();
  };
  const readFirst = (
    path: string,
    where?: JSOStoreWhere,
  ): JSOStoreRecord | null => {
    let records = _access(path);
    if (records === null) {
      return null;
    }
    if (where) {
      const whereFilter = _filter(where);
      for (const record of records) {
        if (whereFilter(record)) {
          return record;
        }
      }
    }
    return records.length > 1 ? records[0] : null;
  };

  const update = (
    path: string,
    payload: JSOStoreRecord,
    where?: JSOStoreWhere,
  ): number | null => {
    let records = _access(path);
    if (records === null) {
      return null;
    }
    let changes = 0;
    const whereFilter = where ? _filter(where) : null;
    _store[path] = records.map((record) => {
      if (whereFilter && !whereFilter(record)) {
        return record;
      }
      changes++;
      const newRecord = { ...record };
      for (const [key, value] of Object.entries(payload)) {
        newRecord[key] = value;
      }
      return newRecord;
    });
    return changes;
  };

  const remove = (path: string, where?: JSOStoreWhere): number | null => {
    const records = _access(path);
    if (records === null) {
      return null;
    }
    let changes = 0;
    const whereFilter = where ? _filter(where) : null;
    _store[path] = records.filter((record) => {
      if (whereFilter && whereFilter(record)) {
        changes++;
        return false;
      }
      return true;
    });
    return changes;
  };

  return {
    initialize,
    create,
    read,
    readFirst,
    update,
    delete: remove,
  };
};

export { JSOPersistence };
export type { JSOStore };
