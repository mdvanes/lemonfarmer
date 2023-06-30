import { HandlerContext, Status } from "$fresh/server.ts";
import { config } from "dotenv/mod.ts";

const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${config().TOKEN}`,
  },
};

// TODO Rename to location and use req params to get by waypoint

// https://docs.spacetraders.io/quickstart/new-game
export const handler = async (
  _req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  try {
    const response = await fetch(
      "https://api.spacetraders.io/v2/systems/X1-YU85/waypoints/X1-YU85-99640B",
      options
    );
    if (response.status === 404) {
      return new Response("Start Location: Not Found", {
        status: Status.NotFound,
      });
    }

    return new Response(response.body);
  } catch (err) {
    return new Response(err.message ?? "Unexpected error", {
      status: Status.InternalServerError,
    });
  }
};
