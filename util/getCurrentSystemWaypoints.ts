import {
  Agent,
  MyAgentResponse,
  Waypoint,
  WaypointsResponse,
} from "../spacetrader.types.ts";
import { options } from "./fetchOptions.ts";

const getMyAgent = async (): Promise<Agent> => {
  const response = await fetch(
    "https://api.spacetraders.io/v2/my/agent",
    options
  );

  if (response.status === 404) {
    throw new Error("My agent not found");
  }
  if (response.status === 401) {
    throw new Error("My agent not authorized");
  }

  const myAgent: MyAgentResponse = await response.json();

  return myAgent.data;
};

const getAgentHqSystem = (agent: Agent): string =>
  agent.headquarters.split("-").slice(0, 2).join("-");

const getSystemWaypoints = async (
  system: string
): Promise<readonly Waypoint[]> => {
  const response = await fetch(
    //       "https://api.spacetraders.io/v2/systems/X1-YU85/waypoints/X1-YU85-99640B",
    `https://api.spacetraders.io/v2/systems/${system}/waypoints`,
    options
  );

  if (response.status === 404) {
    // return new Response("Start Location: Not Found", {
    //   status: Status.NotFound,
    // });
    throw new Error("System not found");
  }

  const waypoints: WaypointsResponse = await response.json();
  return waypoints.data;
};

export const getCurrentSystemWaypoints = async (): Promise<
  readonly Waypoint[]
> => {
  const myAgent = await getMyAgent();
  const agentHqSystem = getAgentHqSystem(myAgent);
  return getSystemWaypoints(agentHqSystem);
};
