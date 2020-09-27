import store from "../store.ts";
import type { Session } from "../middlewares/session-middleware.ts";

const isLoggedIn = (session: Session) =>
  Object.prototype.hasOwnProperty.call(session, "userId");
const login = async (session: Session, body: any) => {
};
const logout = async (session: Session) => {
};
const getMe = async (session: Session) => {
  return { hello: "sailor" };
};

export { isLoggedIn, login, logout, getMe };
