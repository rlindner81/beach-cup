import { Application, Router, Context } from "../deps.ts";

const app = new Application();

app.use((ctx: Context) => {
  ctx.response.body = "Hello World!";
});

await app.listen({ port: 8000 });
