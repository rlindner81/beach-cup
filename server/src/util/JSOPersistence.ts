import { exists } from "https://deno.land/std@0.70.0/fs/mod.ts";

type JSOStoreInner = { [key: string]: JSOStore };
type JSOStore = string | number | boolean | JSOStoreInner;

const JSOPersistence = async (
  filepath = "./store.json",
  pollTimeout = 1000,
) => {
  let _store: JSOStoreInner = Object.create(null);

  const _flush = async () =>
    Deno.writeTextFile(filepath, JSON.stringify(_store));
  const _unflush = async () => {
    await exists(filepath) && (
      _store = JSON.parse(await Deno.readTextFile(filepath))
    );
  };

  await _unflush();
  setInterval(async () => _flush(), pollTimeout);

  const _access = (
    accessPath: string,
  ): JSOStoreInner | null => {
    const keys = accessPath.split("/");
    if (keys.length < 1) {
      return null;
    }
    try {
      let node = _store;
      for (let i = 0; i < keys.length; i++) {
        node = node[keys[i]] as JSOStoreInner;
      }
      return node;
    } catch (err) {
      return null;
    }
  };

  const create = (accessPath: string, name: string, payload: JSOStore) => {
    const node = _access(accessPath);
    if (node === null) {
      return null;
    }
    node[name] = payload;
  };
  const read = (accessPath: string) => _access(accessPath);
  const update = (accessPath: string, name: string, payload: JSOStore) => {
    const node = _access(accessPath);
    if (node === null) {
      return null;
    }
    node[name] = Object.assign(payload, node[name]);
  };
  const remove = (accessPath: string) => {
  };
  return {
    create,
    read,
    update,
    delete: remove,
  };
};

export default JSOPersistence;
