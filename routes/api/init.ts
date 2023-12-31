import { HandlerContext, Status } from "$fresh/server.ts";

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
  _ctx: HandlerContext
): Promise<Response> => {
  try {
    const response = await fetch(
      "https://api.spacetraders.io/v2/register",
      options
    );
    if (response.status === 404) {
      return new Response("Init: Not Found", { status: Status.NotFound });
    }
    if (response.status === 409) {
      const data = (await response.json()) as {
        error?: { data?: { agentSymbol?: string } };
      };
      return new Response(
        `Agent ${data.error?.data?.agentSymbol} already exists`,
        {
          status: Status.Conflict,
        }
      );
    }

    return new Response(response.body);
  } catch (err) {
    return new Response(err.message ?? "Unexpected error", {
      status: Status.InternalServerError,
    });
  }
};
