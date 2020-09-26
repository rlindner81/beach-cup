import { exists } from "https://deno.land/std@0.70.0/fs/mod.ts";

const JSOPersistence = async (
  filepath = "./store.json",
  pollTimeout = 1000,
) => {
  let _store: Record<string, unknown> | null = null;

  const _flush = async () =>
    Deno.writeTextFile(filepath, JSON.stringify(_store));
  const _unflush = async () => {
    _store = (await exists(filepath))
      ? await Deno.readTextFile(filepath)
      : Object.create(null);
  };

  await _unflush();
  setInterval(async () => _flush(), pollTimeout);

  const _access = (
    accessPath: string,
  ) => {
    const keys = accessPath.split("/");
    if (keys.length < 1) {
      return null;
    }
    try {
      let node: unknown = _store;
      for (let i = 0; i < keys.length; i++) {
        node = node[keys[i]];
      }
      return node === undefined ? null : node;
    } catch (err) {
      return null;
    }
  };

  const create = (accessPath: string, name: string, payload: unknown) => {
    _access(accessPath)[name] = payload;
  };
  const read = (accessPath: string) => _access(accessPath);
  const update = (accessPath: string, name: string, payload: unknown) => {
    const node = _access(accessPath)[name];
    node[name] = Object.assign(payload, node);
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
