import { Application, Router, Context } from "../deps.ts";
import { JSOPersistence } from "./util/JSOPersistence.ts";

const store = JSOPersistence();
const app = new Application();

app.use((ctx: Context) => {
  ctx.response.body = "Hello World!";
});

await app.listen({ port: 8000 });
