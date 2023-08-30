import { paths, external } from "./generated/schema.d.ts";

/*
Codegen:
npx openapi-typescript https://raw.githubusercontent.com/SpaceTradersAPI/api-docs/main/reference/SpaceTraders.json --alphabetize --immutable-types -o ./generated/schema.d.ts
Almost works (maybe with https://github.com/drwpow/openapi-typescript/tree/main/packages/openapi-typescript#-node):
deno run https://esm.sh/openapi-typescript/bin/cli.js https://raw.githubusercontent.com/SpaceTradersAPI/api-docs/main/reference/SpaceTraders.json --alphabetize --immutable-types -o ./generated/schema.d.ts
*/

// export interface Agent {
//   accountId: string;
//   symbol: string;
//   headquarters: string; // e.g. "X1-YU85-99640B";
//   credits: number;
//   startingFaction: string; // should be union of "COSMIC"...;
// }
export type Agent = external["../models/Agent.json"];

// export interface MyAgentResponse {
//   data: Agent;
// }
export type MyAgentResponse =
  paths["/my/agent"]["get"]["responses"][200]["content"]["application/json"];

// export interface Waypoint {
//   chart: any;
//   faction: any;
//   orbitals: any;
//   symbol: string;
//   systemSymbol: string;
//   traits: any[];
//   x: number;
//   y: number;
//   type: string; // e.g. PLANET should be union
// }
export type Waypoint = external["../models/Waypoint.json"];

// export interface WaypointsResponse {
//   data: Waypoint[];
// }
export type WaypointsResponse =
  paths["/systems/{systemSymbol}/waypoints"]["get"]["responses"][200]["content"]["application/json"];

export interface ChartItem {
  name: string;
  x: number;
  y: number;
  type: Waypoint["type"] & System["type"];
}

export type System = external["../models/System.json"];

export type SystemsResponse =
  paths["/systems"]["get"]["responses"][200]["content"]["application/json"];

// Writeable version of WaypointsResponse
export interface UnsafeWaypointsResponse {
  data: external["../models/Waypoint.json"][];
  meta: external["../models/Meta.json"];
}

// Writeable version of WaypointOrbital
// type Writeable<T> = { -readonly [P in keyof T]: T[P] };
export type UnsafeWaypointOrbital = external["../models/WaypointOrbital.json"];

export interface Planet extends Omit<Waypoint, "type"> {
  type: "PLANET";
}

export interface Moon extends Omit<Waypoint, "type"> {
  type: "MOON";
}

export interface PlanetWithMoons extends Planet {
  type: "PLANET";
  moons: Moon[];
}
