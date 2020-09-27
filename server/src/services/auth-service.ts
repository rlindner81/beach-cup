import store from "../store.ts";
import { bcrypt, Status } from "../deps.ts";
import type { Context } from "../deps.ts";
import Error from "../errors.ts";

const isLoggedIn = (ctx: Context) =>
  Object.prototype.hasOwnProperty.call(ctx.state.session, "userId");

const login = async (ctx: Context) => {
  ctx.assert(ctx.request.hasBody, Status.UnprocessableEntity);
  const { email, password } = await ctx.request.body({ type: "json" }).value;
  ctx.assert(email !== undefined, Status.UnprocessableEntity, Error.UserNotFound);
  const dbUser = store.readFirst("./users", { email });
  ctx.assert(dbUser !== null, Status.UnprocessableEntity, Error.UserNotFound);
  const match = await bcrypt.compare(password, dbUser.password as string);
  ctx.assert(match, Status.Unauthorized, Error.WrongPassword);
  ctx.state.session.userId = dbUser.id;
};

const logout = async (ctx: Context) => {
  Reflect.deleteProperty(ctx.state.session, "userId");
};

const getMe = async (ctx: Context) => {
  const me = store.readFirstAndClone("./users", { id: ctx.state.session.userId });
  ctx.assert(me !== null, Status.UnprocessableEntity, Error.UserNotFound);
  Reflect.deleteProperty(me, "id");
  Reflect.deleteProperty(me, "password");
  return me;
};

const updateMe = async (ctx: Context) => {
  return getMe(ctx);
};

const register = async (ctx: Context) => {
};

export { isLoggedIn, login, logout, getMe, updateMe, register };
