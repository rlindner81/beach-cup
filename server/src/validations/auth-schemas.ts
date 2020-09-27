import { validasaur } from "../deps.ts";
const { required, isString, isEmail, lengthBetween } = validasaur;

const loginSchema = {
  email: [required, isString, isEmail, lengthBetween(1, 256)],
  password: [required, isString, lengthBetween(1, 256)],
};

const meSchema = {
  name: [isString, lengthBetween(1, 256)],
  email: [isString, isEmail, lengthBetween(1, 256)],
  password: [isString, lengthBetween(1, 256)],
};

const registerSchema = {
  name: [required, isString, lengthBetween(1, 256)],
  email: [required, isString, isEmail, lengthBetween(1, 256)],
  password: [required, isString, lengthBetween(1, 256)],
};

export { loginSchema, meSchema, registerSchema };
