import { exists } from "https://deno.land/std@0.70.0/fs/mod.ts";

// TODO Arrays???

type JSOStoreInner = { [key: string]: JSOStore };
type JSOStore = string | number | boolean | JSOStoreInner;

const JSOPersistence = async (
  filepath = "./store.json",
  pollTimeout = 1000,
) => {
  let _store: JSOStoreInner = Object.create(null);

  const _flush = async (): Promise<void> =>
    Deno.writeTextFile(filepath, JSON.stringify(_store));
  const _unflush = async (): Promise<void> => {
    if (await exists(filepath)) {
      _store = JSON.parse(await Deno.readTextFile(filepath));
    }
  };

  await _unflush();
  setInterval(async () => _flush(), pollTimeout);

  const _accessInner = (
    path: string,
  ): JSOStoreInner | null => {
    const keys = path.split("/");
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

  const create = (
    path: string,
    name: string,
    payload: JSOStore,
  ): JSOStore | null => {
    const node = _accessInner(path);
    if (node === null) {
      return null;
    }
    node[name] = payload;
    return node[name];
  };
  const read = (path: string, name: string): JSOStore | null => {
    const node = _accessInner(path);
    if (node === null) {
      return null;
    }
    return node[name];
  };
  const update = (
    path: string,
    name: string,
    payload: JSOStore,
  ): JSOStore | null => {
    const node = _accessInner(path);
    if (node === null) {
      return null;
    }
    node[name] = Object.assign(payload, node[name]);
    return node[name];
  };
  const remove = (path: string, name: string): JSOStore | null => {
    const node = _accessInner(path);
    if (node === null) {
      return null;
    }
    const value = node[name];
    Reflect.deleteProperty(node, name);
    return value;
  };

  return {
    create,
    read,
    update,
    delete: remove,
  };
};

export default JSOPersistence;
export type { JSOStore };
