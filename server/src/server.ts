import { Application } from "./deps.ts";
import store from "./store.ts";
import sessionMiddleware from "./middlewares/session-middleware.ts";
import AuthRouter from "./routes/auth-route.ts";

const envCookieKey = Deno.env.get("COOKIE_KEY");
const envPort = Deno.env.get("PORT");
const appOptions = envCookieKey ? { keys: [envCookieKey] } : {};

const app = new Application(appOptions);
const port = envPort ? parseInt(envPort) : 8080;

await store.initialize();

app.use(sessionMiddleware);

const authRouter = AuthRouter({ prefix: "/api/auth" });
app.use(authRouter.allowedMethods());
app.use(authRouter.routes());

console.log("listening on port %d", port);
await app.listen({ port });
