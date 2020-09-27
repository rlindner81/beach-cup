import {
  login,
  logout,
  getMe,
  updateMe,
  register,
} from "../services/auth-service.ts";
import authMiddleware from "../middlewares/auth-middleware.ts";
import { Context, Router, RouterOptions, Status } from "../deps.ts";

export default (options?: RouterOptions) => {
  const router: Router = new Router(options);

  router.post("/login", async (ctx: Context) => {
    await login(ctx);
    ctx.response.body = "Login successful";
  });

  router.post("/logout", async (ctx: Context) => {
    await logout(ctx);
    ctx.response.body = "Logout successful";
  });

  router.get("/me", authMiddleware, async (ctx: Context) => {
    const me = await getMe(ctx);
    ctx.response.body = me;
  });

  router.patch("/me", authMiddleware, async (ctx: Context) => {
    const me = await updateMe(ctx);
    ctx.response.body = me;
  });

  router.post("/register", authMiddleware, async (ctx: Context) => {
    await register(ctx);
    ctx.response.status = Status.Created;
  });

  return router;
};
