import store from "../store.ts";
import type { Context } from "../deps.ts";

const SESSION_COOKIE_KEY = "sid";

const SessionMiddlewares = () => {
  return async (ctx: Context, next: () => Promise<void>) => {
    const sessionId = ctx.cookies.get(SESSION_COOKIE_KEY);
    let session = null;
    if (sessionId) {
      session = store.readFirst("./session", { id: parseInt(sessionId) });
    } else {
      session = store.create("./session", {});
      if (!session || !session.id) {
        throw new Error("created invalid sessionid");
      }
      ctx.cookies.set(
        SESSION_COOKIE_KEY,
        String(session.id),
      );
    }
    ctx.state.session = session;
    await next();
  };
};

export default SessionMiddlewares;
