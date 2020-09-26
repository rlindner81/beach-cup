import authService from "../services/auth-service.ts";
import authMiddleware from "../middlewares/auth-middleware.ts";
import { Router, RouterOptions, Status } from "../deps.ts";
import store from "../store.ts";

export default (options: RouterOptions) => {
  const router: Router = new Router(options);

  router.get("/test", async (ctx) => {
    store.create("./users", { name: "navi" });
    const users = store.read("./users");
    ctx.response.body = JSON.stringify(users);
  });

  // router.post("/login", async (ctx, next) => {
  //   authService.logout(ctx.state.session, ctx.request.body)
  //     .then(() => {
  //       ctx.response.body = "Login successful";
  //     })
  //     .catch(next);
  // });

  // router.post("/logout", async (ctx, next) => {
  //   authService.logout(ctx.state.session)
  //     .then(() => {
  //       ctx.response.body = "Logout successful";
  //     })
  //     .catch(next);
  // });

  // router.get("/me", authMiddleware, async (ctx, next) => {
  //   authService.getMe(ctx.state.session)
  //     .then((result) => {
  //       ctx.response.body = result;
  //     })
  //     .catch(next);
  // });

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
