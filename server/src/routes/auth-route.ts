import { login, logout, getMe } from "../services/auth-service.ts";
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
    ctx.response.body = JSON.stringify(me);
  });

  // router.patch("/me", authMiddleware, async (ctx, next) => {
  //   authService.updateMe(ctx.state.session, ctx.request.body)
  //     .then((result) => {
  //       ctx.response.body = result;
  //     })
  //     .catch(next);
  // });

  // router.post("/register", authMiddleware, async (ctx, next) => {
  //   authService.register(ctx.state.session, ctx.request.body)
  //     .then(() => {
  //       ctx.response.status = Status.Created;
  //       ctx.response.body = "Login successful";
  //     })
  //     .catch(next);
  // });

  return router;
};
