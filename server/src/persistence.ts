import {
  exists,
} from "https://deno.land/std@0.70.0/fs/mod.ts";

const JSOPersistence = async (filepath: string, pollTimeout: number) => {
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

  const create = () => {};
  const read = () => {};
  const update = () => {};
  const remove = () => {
  };
};

export default JSOPersistence;
