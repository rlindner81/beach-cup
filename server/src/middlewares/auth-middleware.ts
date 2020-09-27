import { Status } from "../deps.ts";
import type { Context } from "../deps.ts";
import { isLoggedIn } from "../services/auth-service.ts";

const AuthMiddleware = async (ctx: Context, next: () => Promise<void>) => {
  ctx.assert(
    isLoggedIn(ctx.state.session),
    Status.Unauthorized,
  );
  await next();
};

export default AuthMiddleware;
