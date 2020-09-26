import { Application } from "./deps.ts";
import store from "./store.ts";
import SessionMiddleware from "./middlewares/session-middleware.ts";
import AuthRouter from "./routes/auth-route.ts";

const app = new Application();
// const sessionMiddleware = SessionMiddleware();
const authRouter = AuthRouter({ routerPath: "/api/auth" });

// app.use(SessionMiddleware());
await store.initialize();

app.use(authRouter.allowedMethods());
app.use(authRouter.routes());

await app.listen({ port: 8000 });
