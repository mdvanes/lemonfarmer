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

// Source: https://kimmosaaskilahti.fi/blog/2019/08/29/using-fp-ts-for-http-requests-and-validation/
export const getWaypointsFp = (): TaskEither<Error, Waypoint[]> => {
  // // I/O action for fetching user from API
  // const getUserThunk: Lazy<Promise<GetResponse>> = () => {
  //     debugLog("getUser");
  //     return this.api.Users.current();
  // };
  const getWaypointResponseThunk: Lazy<
    Promise<{ status: number; payload: object }>
    // Promise<unknown>
  > = async () => {
    const system = "X1-JX88"; // TODO
    const response = await fetch(
      `https://api.spacetraders.io/v2/systems/${system}/waypoints`,
      options
    );
    const payload = await response.json();

    // TODO this is ridiculous of course, you want to validate status before resolving json()
    return {
      status: response.status,
      payload,
    };
  };

  // // Validate user profile
  // const validateUserProfile = (
  //     response: object
  // ): Either<Error, GitLabUserProfile> => {
  //     // TODO Better validation
  //     return hasKey(response, "id")
  //     ? right(response as GitLabUserProfile)
  //     : left(Error("Invalid user profile"));
  // };
  const validateWaypointResponse = (response: {
    status: number;
    payload: object; // TODO fix object type
  }): Either<Error, UnsafeWaypointsResponse> => {
    debugLog("validateWaypointResponse", response.status);
    return response.status >= 200 && response.status < 400
      ? right(response.payload as UnsafeWaypointsResponse)
      : left(Error("System not found"));
  };

  // TODO should take Either?
  //   const mapWaypointResponseToWaypoints = (response: WaypointsResponse): readonly Waypoint[] => {
  //     return response.data;
  //   };
  const mapWaypointResponseToWaypoints = (
    response: UnsafeWaypointsResponse
  ): Waypoint[] => {
    return response.data;
  };

  // TODO const validateWaypoint - has x,y ; has faction

  // TODO filter only type=planet (moons for planets?)

  // Pipe computations
  const result = pipe(
    getWaypointResponseThunk,
    TE.fromThunk,
    logValue("getWaypointResponseThunk"),
    TE.chainEither(validateWaypointResponse),
    map(mapWaypointResponseToWaypoints),
    map((w) =>
      pipe(
        w,
        A.filter((p) => Boolean(p.x))
      )
    )
  );

  return result;
};
