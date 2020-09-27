import { validasaur, Status } from "../deps.ts";
import type { Context } from "../deps.ts";
const { validate, flattenMessages } = validasaur;

const ValidateMiddleware = (schema: validasaur.ValidationRules) =>
  async (ctx: Context, next: () => Promise<void>) => {
    ctx.assert(ctx.request.hasBody, Status.UnprocessableEntity);
    const [passes, errors] = await validate(
      await ctx.request.body({ type: "json" }).value,
      schema,
    );
    ctx.assert(
      passes,
      Status.UnprocessableEntity,
      JSON.stringify(flattenMessages(errors)),
    );
    await next();
  };

export default ValidateMiddleware;
