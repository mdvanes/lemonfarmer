import { HandlerContext } from "$fresh/server.ts";

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    symbol: "lemonfarmer",
    faction: "COSMIC",
  }),
};

// https://docs.spacetraders.io/quickstart/new-game
export const handler = async (
  _req: Request,
  ctx: HandlerContext
): Promise<Response> => {
  try {
    const resp = await fetch(
      "https://api.spacetraders.io/v2/register",
      options
    );
    if (resp.status === 404) {
      return ctx.render(null);
    }
    return new Response(resp.body);
  } catch (err) {
    return new Response(err);
  }
};
