import store from "../store.ts";
import type { Context } from "../deps.ts";

const SESSION_COOKIE_KEY = "sid";
const SESSION_COOKIE_LIFETIME_SECONDS = 365 * 24 * 3600; // 1 year

const SessionMiddleware = async (ctx: Context, next: () => Promise<void>) => {
  const userId = ctx.cookies.get(SESSION_COOKIE_KEY);
  let session = null;
  if (userId) {
    const user = store.readFirst("./user", { nameOrEmail: userId });
    ctx.state.session = { user };
  } else {
    // session = store.create("./session", {});
    // if (!session || !session.id) {
    //   throw new Error("created invalid sessionid");
    // }
    // ctx.cookies.set(
    //   SESSION_COOKIE_KEY,
    //   String(session.id),
    //   { maxAge: SESSION_COOKIE_LIFETIME_SECONDS },
    // );
  }
  await next();
  // did the session change???
};

export default SessionMiddleware;
