import store from "../store.ts";
import type { Context } from "../deps.ts";

const SESSION_COOKIE_KEY = "sid";

const SessionMiddlewares = () => {
  return (ctx: Context) => {
    const sessionId = ctx.cookies.get(SESSION_COOKIE_KEY, { signed: true });
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
        session.id as string,
        { signed: true, secure: true },
      );
    }
    ctx.state.session = session;
  };
};

export default SessionMiddlewares;
