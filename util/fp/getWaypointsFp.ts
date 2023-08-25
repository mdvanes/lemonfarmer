import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import { Task } from "fp-ts/lib/Task";
import { TaskEither } from "fp-ts/lib/TaskEither";
import { Lazy, pipe } from "fp-ts/lib/function";
import { Waypoint, WaypointsResponse } from "../../spacetrader.types.ts";
import { options } from "../fetchOptions.ts";
import { Either, left, right } from "fp-ts/lib/Either";
import TE from "./taskEitherUtils.ts";

const debugLog = console.debug;

const logValue = TE.logValueWith(debugLog);

// Source: https://kimmosaaskilahti.fi/blog/2019/08/29/using-fp-ts-for-http-requests-and-validation/
export const getWaypointsFp = (): TaskEither<Error, WaypointsResponse> => {
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
    // console.log("foo1");
    const response = await fetch(
      `https://api.spacetraders.io/v2/systems/${system}/waypoints`,
      options
    );
    // console.log("foo2");
    // return response;
    // return response.json();
    const payload = await response.json();

    // console.log(
    //   "foo3",
    //   payload,
    //   payload.data.map((m: any) => m.x)
    // );

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
    payload: object;
  }): Either<Error, WaypointsResponse> => {
    return response.status > 200 && response.status < 400
      ? right(response.payload as WaypointsResponse)
      : left(Error("System not found"));
  };

  // TODO const validateWaypoint - has x,y ; has faction

  // getWaypointResponseThunk();

  // Pipe computations
//   console.log("this is called, but pipe is not executed?");
  return pipe(
    getWaypointResponseThunk,
    // logValue("getWaypointResponseThunk"),
    TE.fromThunk,
    logValue("getWaypointResponseThunk"),
    TE.chainEither(validateWaypointResponse)
  );
};
