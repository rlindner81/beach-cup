import { Application, Router, Context } from "../deps.ts";
import { JSOPersistence } from "./util/JSOPersistence.ts";

const store = JSOPersistence();
const app = new Application();

app.use((ctx: Context) => {
  ctx.response.body = "Hello World!";
});

await store.initialize();
const name = store.create("./names", { givenName: "richard", familyName: "lindner" });
if (name !== null) {
  const allNames = store.read("./names");
  const myName = store.readOne("./names", { id: name.id });
  const updateCount = store.update("./names", { givenName: "valentin" }, { id: name.id });
  const changedNames = store.read("./names", { id: name.id });
  const deleteCount = store.delete("./names", { id: name.id });
  const noNames = store.read("./names", { id: name.id });
  const i = 0;
}

await app.listen({ port: 8000 });
