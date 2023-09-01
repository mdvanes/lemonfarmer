import * as A from "fp-ts/Array";
import { Either, left, right } from "fp-ts/lib/Either";
import { TaskEither, map } from "fp-ts/lib/TaskEither";
import { Lazy, pipe } from "fp-ts/lib/function";
import { external } from "../../generated/schema.d.ts";
import { UnsafeWaypointsResponse, Waypoint } from "../../spacetrader.types.ts";
import { options } from "../fetchOptions.ts";
// import TE from "./taskEitherUtils.ts";
import { PlanetWithMoons } from "../../spacetrader.types.ts";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import { mapWaypointResponseToWaypoints, validateWaypointResponse } from "./waypointHelpers.ts";
import { createLogger } from "./logHelpers.ts";

const logger = createLogger("getPlanetsWithMoonFpAlt");

// TODO variant of getPlanetsWithMoonsFp conform https://rlee.dev/practical-guide-to-fp-ts-part-3
// Does not use helpers from taskEitherUtils
export const createGetPlanetsWithMoonsFpAlt =
  // (url: string) => (): TaskEither<Error, PlanetWithMoons[]> => {
  (url: string) => (): TaskEither<Error, any> => {
    // const getWaypointResponseThunk: TaskEither<Error, any> = () => {
    //   const ok = pipe(
    //     TE2.tryCatch(
    //       async () => {
    //         // error state: 'https://httpstat.us/500'
    //         const response = await fetch(url, options);
    //         const payload = await response.json();

    //         return payload;
    //       },
    //       (reason) => new Error("??")
    //     )
    //   );
    //   return ok;
    // };

    const getWaypointResponseThunk: TaskEither<Error, any> = pipe(
      TE.tryCatch(
        async () => {
          // error state: 'https://httpstat.us/500'
          // const response = await fetch('https://httpstat.us/500');
          const response = await fetch(url, options);
          const payload = await response.json();

          return {
            status: response.status,
            payload,
          };
        },
        (reason) => new Error("??")
      ),
      // TE.map(logger('foo')),
      // TE.map(logger('has .data?', x => Boolean(x.data))),
      TE.chainEitherK(validateWaypointResponse),
      TE.map(mapWaypointResponseToWaypoints),
      // TE.map(logger('bar', x => x)),
      TE.map((w) =>
        pipe(
          w,
          A.map(logger("waypoint symbol:", (x) => x.symbol))
          // A.map((w1) => w1.systemSymbol)
        )
      )
    );
    // console.log(await getWaypointResponseThunk())

    return getWaypointResponseThunk;
  };

export const getPlanetsWithMoonsFpAlt = (): TaskEither<
  Error,
  PlanetWithMoons[]
> => {
  const system = "X1-QB20";
  const url = `https://api.spacetraders.io/v2/systems/${system}/waypoints`;
  return createGetPlanetsWithMoonsFpAlt(url)();
};
