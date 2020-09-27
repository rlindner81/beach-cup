import store from "../store.ts";
import type { Session } from "../middlewares/session-middleware.ts";

const isLoggedIn = (session: Session) =>
  Object.prototype.hasOwnProperty.call(session, "userId");
const login = async (session: Session, body: any) => {
  session.userId = 1;
};
const logout = async (session: Session) => {
  Reflect.deleteProperty(session, "userId");
};
const getMe = async (session: Session) =>
  store.readFirst("./users", { userId: session.userId });

export { isLoggedIn, login, logout, getMe };
