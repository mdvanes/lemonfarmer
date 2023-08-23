import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import { Task } from "fp-ts/lib/Task";
import { TaskEither } from "fp-ts/lib/TaskEither";
import { Lazy, pipe } from "fp-ts/lib/function";
import { Waypoint, WaypointsResponse } from "../spacetrader.types.ts";
// import { options } from "../util/fetchOptions.ts";
import { Either, left, right } from "fp-ts/lib/Either";
import TE from "../util/taskEitherUtils.ts";
import { config } from "dotenv/mod.ts";

const debugLog = console.debug;

const logValue = TE.logValueWith(debugLog);

const options = {
  headers: {
    "Content-Type": "application/json",
    // During alpha token expires every 2 weeks, then you have to re-register by calling http://localhost:8000/api/init and storing the resulting token in .env
    Authorization: `Bearer ${config().TOKEN}`,
  },
};

function add1(num: number): number {
  return num + 1;
}

function multiply2(num: number): number {
  return num * 2;
}

function concat(
  a: number,
  transformer: (a: number) => string
): [number, string] {
  return [a, transformer(a)];
}

const getPossiblyNullSystem = (): string | null => {
  return "system-id";
};

interface FWaypoint {
  type: string;
}

const getPossiblyNullWaypointTypes = (
  system: string
): Array<FWaypoint | null> | null => {
  return [];
};

const fwaypoint = {
  type: "planet",
} as FWaypoint | null;

// type Option<A> = None | Some<A>

export const Fp = () => {
  //   pipe(fwaypoint, ({ type }) => type);
  const x = pipe(
    fwaypoint,
    O.fromNullable,
    O.map(({ type }) => type)
  );
  console.log(x);

  const y = pipe(
    null,
    O.fromNullable,
    O.map(({ type }) => type)
  );
  console.log(y);

  const head = (as: Array<FWaypoint>): O.Option<FWaypoint> =>
    as.length === 0 ? O.none : O.some(as[0]);

  const z = getPossiblyNullWaypointTypes("a");
  //   const z1a = O.map(pipe(z, O.fromNullable));
  const foo: Array<FWaypoint | null> = [{ type: "planet" }, null];
  const z1 = pipe(
    // z,
    // O.fromNullable,
    foo,
    A.filterMap(O.fromNullable),
    A.map(({ type }) => type)
    // head,
    // O.map((n) => n),
    // A.map((n: O.Option<FWaypoint>) =>
    //   flow(
    //     n,
    //     O.fromNullable,
    //     O.map(({ type }) => type)
    //   )
    // )
    // A.map((n) =>
    //   O.chain(
    //     flow(
    //       n,
    //       O.fromNullable,
    //       O.map(({ type }) => type)
    //     )
    //   )
    // )
  );

  /* 1 this works */
  const someWaypointOrNulls: Array<FWaypoint | null> = [
    { type: "planet" },
    null,
  ];
  const waypointTypes = pipe(
    someWaypointOrNulls,
    A.filterMap(O.fromNullable),
    A.map(({ type }) => type)
  );
  /* 1 end this works */

  /* 2 this works */
  //   const someWaypointOrNulls2: Array<FWaypoint | null> | null = null;
  const waypointTypes2 = pipe(
    // someWaypointOrNulls2,
    getPossiblyNullWaypointTypes("a"),
    O.fromNullable,
    O.match(
      () => [],
      (x) => x
    ),
    A.filterMap(O.fromNullable),
    A.map(({ type }) => type)
  );
  console.log(waypointTypes2);
  /* 2 end this works */

  /// TODO add promises
  const boolTask: Task<boolean> = async () => {
    try {
      await Promise.resolve();
      return true;
    } catch (err) {
      return false;
    }
  };

  const getSystemWaypointsWithFactionFp = async (
    system: string
  ): Promise<readonly Waypoint["faction"][]> => {
    const response = await fetch(
      `https://api.spacetraders.io/v2/systems/${system}/waypoints` // TODO options with bearer token
    );

    if (response.status === 404) {
      // TODO can fail - https://rlee.dev/practical-guide-to-fp-ts-part-3#handled-failures-cant-fail
      throw new Error("System not found");
    }

    // All waypoints
    const waypoints: WaypointsResponse = await response.json();

    // waypoint.faction is possibly undefined -> filter like with isDefined
    const factions = waypoints.data.map((waypoint) => waypoint.faction);

    return factions; // TODO why not type error when returning factions with Task<readonly Waypoint[]> as the function return type?
  };

  // Source: https://kimmosaaskilahti.fi/blog/2019/08/29/using-fp-ts-for-http-requests-and-validation/
  const getWaypointsFp = (): TaskEither<Error, WaypointsResponse> => {
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
      console.log("foo1");
      const response = await fetch(
        `https://api.spacetraders.io/v2/systems/${system}/waypoints`,
        options
      );
      console.log("foo2");
      // return response;
      // return response.json();
      const payload = await response.json();

      console.log(
        "foo3",
        payload,
        payload.data.map((m: any) => m.x)
      );

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
    console.log("this is called, but pipe is not executed?");
    return pipe(
      getWaypointResponseThunk, // TODO this is never executed, expected that fromThunk does this?
      // logValue("getWaypointResponseThunk"),
      TE.fromThunk,
      logValue("getWaypointResponseThunk"),
      TE.chainEither(validateWaypointResponse)
    );
  };

  // useEffect(() => {
  //   const run = async () => {
  //     await getWaypointsFp();
  //   };
  //   run();
  // });
  getWaypointsFp();

  return <div>fp {pipe(1, add1, multiply2)}</div>;
};
