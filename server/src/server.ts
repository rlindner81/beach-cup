import { Application } from "./deps.ts";
import store from "./store.ts";
import SessionMiddleware from "./middlewares/session-middleware.ts";
import AuthRouter from "./routes/auth-route.ts";

const app = new Application();
const envPort = Deno.env.get("PORT");
const port = envPort ? parseInt(envPort) : 8080;

await store.initialize();

// const sessionMiddleware = SessionMiddleware();
// app.use(sessionMiddleware());

const authRouter = AuthRouter({ prefix: "/api/auth" });
app.use(authRouter.allowedMethods());
app.use(authRouter.routes());

console.log("listening on port %d", port);
await app.listen({ port });
