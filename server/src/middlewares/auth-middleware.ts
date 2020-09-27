import type { Context } from "../deps.ts";
import { isLoggedIn } from "../services/auth-service.ts";

const AuthMiddleware = async (ctx: Context, next: () => Promise<void>) => {
  if (!isLoggedIn(ctx.state.session)) {
    throw Error("missing authorization");
  }
  await next();
};

export default AuthMiddleware;
