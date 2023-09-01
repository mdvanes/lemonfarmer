import * as A from "fp-ts/Array";
import * as TE from "fp-ts/lib/TaskEither";
import { Lazy, pipe } from "fp-ts/lib/function";
import {
  Moon,
  Planet,
  PlanetWithMoons,
  UnsafeWaypointOrbital,
  UnsafeWaypointsResponse,
  Waypoint,
} from "../../spacetrader.types.ts";
import { options } from "../fetchOptions.ts";
import TEUtils from "./taskEitherUtils.ts";
import {
  mapWaypointResponseToWaypoints,
  validateWaypointResponse,
} from "./waypointHelpers.ts";

const debug =
  (fileName: string) =>
  (...args: unknown[]) =>
    console.debug(`[${fileName}] DEBUG:`, ...args);

export const debugLog = debug("getWaypointsFp");

export const logValue = TEUtils.logValueWith(debugLog);

const isValidWaypoint = (waypoint: Waypoint): boolean =>
  typeof waypoint.x !== "undefined" &&
  typeof waypoint.y !== "undefined" &&
  typeof waypoint.faction !== "undefined";

const isPlanet = (waypoint: Waypoint): waypoint is Planet =>
  waypoint.type === "PLANET";

const isMoon = (waypoint: Waypoint): waypoint is Moon =>
  waypoint.type === "MOON";

// Source: https://kimmosaaskilahti.fi/blog/2019/08/29/using-fp-ts-for-http-requests-and-validation/
export const createGetPlanetsWithMoonsFp =
  (url: string) => (): TE.TaskEither<Error, PlanetWithMoons[]> => {
    const getWaypointResponseThunk: Lazy<
      Promise<{ status: number; payload: UnsafeWaypointsResponse }>
    > = async () => {
      const response = await fetch(url, options);
      const payload = await response.json();

      // TODO error handeling is missing?
      // TODO this is ridiculous of course, you want to validate status before resolving json()
      return {
        status: response.status,
        payload,
      };
    };

    const aggregateMoonsByPlanet =
      (waypoints: Waypoint[]) =>
      (p: Planet): PlanetWithMoons => {
        return {
          ...p,
          // NOTE: implementation that has to flatten, because filter is used where only one result is expected
          // moons: pipe(
          //   p.orbitals as UnsafeWaypointOrbital[],
          //   A.flatMap((o) =>
          //     pipe(
          //       waypoints,
          //       A.filter(isMoon),
          //       A.filter((w) => w.symbol === o.symbol)
          //     )
          //   )
          // ),
          // NOTE: implementation where findFirst returns an Option<Moon>, where filterMap only keeps the Some values
          moons: pipe(
            p.orbitals as UnsafeWaypointOrbital[],
            // filterMap only keeps the Some values
            A.filterMap((o) =>
              pipe(
                waypoints,
                A.filter(isMoon),
                A.findFirst((w) => w.symbol === o.symbol)
              )
            )
          ),
        };
      };

    // Pipe computations
    const result = pipe(
      getWaypointResponseThunk,
      TEUtils.fromThunk,
      // logValue("getWaypointResponseThunk"),
      TEUtils.chainEither(validateWaypointResponse),
      TE.map(mapWaypointResponseToWaypoints),
      // logValue("waypoints"),

      // TODO TE.flatMap() -> maybe possible to prevent nested pipes with flow

      TE.map((waypoints) =>
        pipe(
          waypoints,
          A.filter(isValidWaypoint),
          A.filter(isPlanet),
          A.map(aggregateMoonsByPlanet(waypoints))
        )
      )
      // logValue("planets")
    );

    return result;
  };

// TODO also implement with do notation
// TODO also implement with fp-ts-effects
// TODO also implement with lodash fp
// TODO also implement without fp-ts

export const getPlanetsWithMoonsFp = (): TE.TaskEither<
  Error,
  PlanetWithMoons[]
> => {
  const system = "X1-QB20";
  const url = `https://api.spacetraders.io/v2/systems/${system}/waypoints`;
  return createGetPlanetsWithMoonsFp(url)();
};
