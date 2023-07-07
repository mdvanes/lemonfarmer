import { config } from "dotenv/mod.ts";
import {
  Agent,
  MyAgentResponse,
  Waypoint,
  WaypointsResponse,
} from "../spacetrader.types.ts";

const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${config().TOKEN}`,
  },
};

const getMyAgent = async (): Promise<Agent> => {
  const response = await fetch(
    "https://api.spacetraders.io/v2/my/agent",
    options
  );

  if (response.status === 404) {
    throw new Error("My agent not found");
  }

  const myAgent: MyAgentResponse = await response.json();

  return myAgent.data;
};

const getAgentHqSystem = (agent: Agent): string =>
  agent.headquarters.split("-").slice(0, 2).join("-");

export const getCurrentSystemWaypoints = async (): Promise<Waypoint[]> => {
  const myAgent = await getMyAgent();
  const agentHqSystem = getAgentHqSystem(myAgent);
  console.log(agentHqSystem);

  const response = await fetch(
    //       "https://api.spacetraders.io/v2/systems/X1-YU85/waypoints/X1-YU85-99640B",
    `https://api.spacetraders.io/v2/systems/${agentHqSystem}/waypoints`,
    options
  );

  if (response.status === 404) {
    // return new Response("Start Location: Not Found", {
    //   status: Status.NotFound,
    // });
    throw new Error("System not found");
  }

  // console.log(await response.json());

  const waypoints: WaypointsResponse = await response.json();
  return waypoints.data;
};
