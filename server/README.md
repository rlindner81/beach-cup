# beach-cup-server

```
# install
deno cache --reload src/server.ts

# run
deno run src/server.ts
```

## dependencies

* https://github.com/deno-postgres/deno-postgres db driver
* https://github.com/halvardssm/deno-nessie db migrations
* https://github.com/oakserver/oak middleware layer

## structure inspired by
* https://github.com/asad-mlbd/deno-api-starter-oak

## ideas
* start with no database but only in-memory data that is persisted periodically
