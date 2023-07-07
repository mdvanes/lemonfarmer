export interface Agent {
  accountId: string;
  symbol: string;
  headquarters: string; // e.g. "X1-YU85-99640B";
  credits: number;
  startingFaction: string; // should be union of "COSMIC"...;
}

export interface MyAgentResponse {
  data: Agent;
}

export interface Waypoint {
  chart: any;
  faction: any;
  orbitals: any;
  symbol: string;
  systemSymbol: string;
  traits: any[];
  x: number;
  y: number;
  type: string; // e.g. PLANET should be union
}

export interface WaypointsResponse {
  data: Waypoint[];
}
