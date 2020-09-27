import store from "../store.ts";

const isLoggedIn = async (session: any) => true;
const login = async (session: any, body: any) => {
};
const logout = async (session: any) => {
};
const getMe = async (session: any) => {
  return { hello: "sailor" };
};

export { isLoggedIn, login, logout, getMe };
