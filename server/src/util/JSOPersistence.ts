import { exists } from "https://deno.land/std@0.71.0/fs/mod.ts";

/**

await store.initialize();
const name = store.create("./names", { givenName: "richard", familyName: "lindner" });
const allNames = store.read("./names", { id: name.id });
const myName = store.readOne("./names", { id: name.id });
const updateCount = store.update("./names", { id: name.id }, { givenName: "valentin" });
const deleteCount = store.delete("./names", { id: name.id });

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
    Deno.writeTextFile(filepath, JSON.stringify(_store));
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
    records: Array<JSOStoreRecord>,
    where: JSOStoreWhere,
    options?: Record<"inverse", boolean>,
  ): Array<JSOStoreRecord> => {
    const i = 0;
    return records;
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
      : { id: records.length, ...payload };
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
    return where ? _filter(records, where) : records;
  };
  const readOne = (
    path: string,
    where?: JSOStoreWhere,
  ): JSOStoreRecord | null => {
    const records = read(path, where);
    if (records === null) {
      return null;
    }
    return records.length === 1 ? records[0] : null;
  };

  const update = (
    path: string,
    payload: JSOStoreRecord,
    where?: JSOStoreWhere,
  ): number | null => {
    const records = read(path, where);
    if (records === null) {
      return null;
    }
    const changes = records.map((record) => {
      for (const [key, value] of Object.entries(payload)) {
        record[key] = value;
      }
    });
    return changes.length;
  };

  const remove = (path: string, where?: JSOStoreWhere): number | null => {
    const records = _access(path);
    if (records === null) {
      return null;
    }
    if (!where) {
      _store[path] = [];
      return records.length;
    }
    const filteredRecords = _filter(records, where, { inverse: true });
    _store[path] = filteredRecords;
    return records.length - filteredRecords.length;
  };

  return {
    initialize,
    create,
    read,
    update,
    delete: remove,
  };
};

export { JSOPersistence };
export type { JSOStore };
