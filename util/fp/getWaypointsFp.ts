import * as A from "fp-ts/Array";
import { Either, left, right } from "fp-ts/lib/Either";
import { TaskEither, map } from "fp-ts/lib/TaskEither";
import { Lazy, pipe } from "fp-ts/lib/function";
import { external } from "../../generated/schema.d.ts";
import { Waypoint } from "../../spacetrader.types.ts";
import { options } from "../fetchOptions.ts";
import TE from "./taskEitherUtils.ts";

const debug =
  (fileName: string) =>
  (...args: unknown[]) =>
    console.debug(`[${fileName}] DEBUG:`, ...args);

const debugLog = debug("getWaypointsFp");

const logValue = TE.logValueWith(debugLog);

// Non-readonly version of WaypointsResponse
interface UnsafeWaypointsResponse {
  data: external["../models/Waypoint.json"][];
  meta: external["../models/Meta.json"];
}

interface Planet extends Omit<Waypoint, "type"> {
  type: "PLANET";
}

interface Moon extends Omit<Waypoint, "type"> {
  type: "MOON";
}

interface PlanetWithMoons extends Planet {
  // type: 'PLANET';
  moons: Moon[]; // Waypoint[];
}

const isValidWaypoint = (waypoint: Waypoint): boolean =>
  typeof waypoint.x !== "undefined" &&
  typeof waypoint.y !== "undefined" &&
  typeof waypoint.faction !== "undefined";

const isPlanet = (waypoint: Waypoint): waypoint is Planet =>
  waypoint.type === "PLANET";

const isMoon = (waypoint: Waypoint): waypoint is Moon =>
  waypoint.type === "MOON";

// Source: https://kimmosaaskilahti.fi/blog/2019/08/29/using-fp-ts-for-http-requests-and-validation/
export const createGetWaypointsFp =
  (url: string) => (): TaskEither<Error, PlanetWithMoons[]> => {
    // // I/O action for fetching user from API
    // const getUserThunk: Lazy<Promise<GetResponse>> = () => {
    //     debugLog("getUser");
    //     return this.api.Users.current();
    // };
    const getWaypointResponseThunk: Lazy<
      Promise<{ status: number; payload: object }>
      // Promise<unknown>
    > = async () => {
      const response = await fetch(url, options);
      const payload = await response.json();

      // TODO this is ridiculous of course, you want to validate status before resolving json()
      return {
        status: response.status,
        payload,
      };
    };

    const validateWaypointResponse = (response: {
      status: number;
      payload: object; // TODO fix object type
    }): Either<Error, UnsafeWaypointsResponse> => {
      debugLog("validateWaypointResponse", response.status);
      return response.status >= 200 && response.status < 400
        ? right(response.payload as UnsafeWaypointsResponse)
        : left(Error("System not found"));
    };

    const mapWaypointResponseToWaypoints = (
      response: UnsafeWaypointsResponse
    ): Waypoint[] => {
      return response.data;
    };

    // TODO There is probably a more fp-ts way to aggregate moons by planet
    const aggregateMoonsByPlanet =
      (waypoints: Waypoint[]) =>
      (p: Planet): PlanetWithMoons => {
        return {
          ...p,
          moons: p.orbitals
            .map((o) =>
              waypoints
                .filter(isMoon)
                .filter((w) => w.symbol === o.symbol && isMoon(w))
            )
            .flat(),
        };
      };

    // Pipe computations
    const result = pipe(
      getWaypointResponseThunk,
      TE.fromThunk,
      // logValue("getWaypointResponseThunk"),
      TE.chainEither(validateWaypointResponse),
      map(mapWaypointResponseToWaypoints),
      map((waypoints) =>
        pipe(
          waypoints,
          A.filter(isValidWaypoint),
          A.filter(isPlanet),
          A.map(aggregateMoonsByPlanet(waypoints))
        )
      )
    );

    return result;
  };

// TODO also implement conform https://rlee.dev/practical-guide-to-fp-ts-part-3

export const getWaypointsFp = (): TaskEither<Error, PlanetWithMoons[]> => {
  const system = "X1-QB20";
  const url = `https://api.spacetraders.io/v2/systems/${system}/waypoints`;
  return createGetWaypointsFp(url)();
};
