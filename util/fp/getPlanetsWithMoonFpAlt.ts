// import { Either, left, right } from "fp-ts/lib/Either";
// import { external } from "../../generated/schema.d.ts";
// import { UnsafeWaypointsResponse, Waypoint } from "../../spacetrader.types.ts";
// import * as IO from "fp-ts/lib/IO";
// import * as T from "fp-ts/lib/Task";
// import TE from "./taskEitherUtils.ts";
import * as A from "fp-ts/Array";
import { TaskEither, map } from "fp-ts/lib/TaskEither";
import { Lazy, pipe } from "fp-ts/lib/function";
import { options } from "../fetchOptions.ts";
import { PlanetWithMoons } from "../../spacetrader.types.ts";
import * as TE from "fp-ts/lib/TaskEither";
import {
  isPlanet,
  mapWaypointResponseToWaypoints,
  validateWaypointResponse,
} from "./waypointHelpers.ts";
import { createLogger } from "./logHelpers.ts";
import { info } from "fp-ts/lib/Console";

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

    // const foo = (): Either<Error, any> => {
    //   return right("");
    // };

    const getWaypointResponseThunk: TaskEither<Error, any> = pipe(
      TE.tryCatch(
        async () => {
          const response = await fetch(url, options);
          const payload = await response.json();

          return {
            status: response.status,
            payload,
          };
        },
        (_reason) => new Error("??")
      ),
      TE.tapIO((r) => info(`has .data? ${Boolean(r.payload.data)}`)),
      TE.flatMapEither(validateWaypointResponse),
      TE.map(mapWaypointResponseToWaypoints),
      TE.map((waypoints) =>
        pipe(
          waypoints,
          A.filter(isPlanet),
          A.map(logger("waypoint symbol:", (x) => x.symbol))
        )
      )
    );

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
