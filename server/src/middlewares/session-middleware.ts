import store from "../store.ts";
import type { Context } from "../deps.ts";

const SESSION_COOKIE_KEY = "sid";
const SESSION_COOKIE_LIFETIME_SECONDS = 365 * 24 * 3600; // 1 year

export type Session = Record<"userId", number>;

const SessionMiddleware = async (ctx: Context, next: () => Promise<void>) => {
  const sessionInCookie = ctx.cookies.get(SESSION_COOKIE_KEY);
  const session = sessionInCookie ? JSON.parse(sessionInCookie) : {};
  ctx.state.session = { ...session };

  await next();

  if (Object.keys(session).length !== Object.keys(ctx.state.session).length) {
    ctx.cookies.set(
      SESSION_COOKIE_KEY,
      session,
      { maxAge: SESSION_COOKIE_LIFETIME_SECONDS },
    );
  }
};

export default SessionMiddleware;
