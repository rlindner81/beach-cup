import { login, logout, getMe } from "../services/auth-service.ts";
import authMiddleware from "../middlewares/auth-middleware.ts";
import { Router, RouterOptions, Status } from "../deps.ts";

export default (options?: RouterOptions) => {
  const router: Router = new Router(options);

  router.post("/login", async (ctx, next) => {
    login(ctx.state.session, ctx.request.body)
      .then(() => {
        ctx.response.body = "Login successful";
      })
      .catch(next);
  });

  router.post("/logout", async (ctx, next) => {
    logout(ctx.state.session)
      .then(() => {
        ctx.response.body = "Logout successful";
      })
      .catch(next);
  });

  router.get("/me", authMiddleware, async (ctx, next) => {
    getMe(ctx.state.session)
      .then((result) => {
        ctx.response.body = result;
      })
      .catch(next);
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
