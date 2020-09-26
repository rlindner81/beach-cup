import { Application, Router, Context } from "../deps.ts";
import store from "./store.ts";

const app = new Application();

app.use((ctx: Context) => {
  ctx.response.body = "Hello World!";
});

await store.initialize();
await app.listen({ port: 8000 });
