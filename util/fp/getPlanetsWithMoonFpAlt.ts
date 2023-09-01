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
import * as IO from "fp-ts/lib/IO";
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
  
const foo = (): Either<Error, any> => {
  return right('')
}

    const getWaypointResponseThunk: TaskEither<Error, any> = pipe(
      TE.tryCatch(
        async () => {
          // error state: 'https://httpstat.us/500'
          // TODO Broken:
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
      // TE.tapIO(info),
      // TE.map(logger('foo')),
      TE.tapIO((r) => info(`has .data? ${Boolean(r.payload.data)}`)),
      // TE.map(logger('has .data?', x => Boolean(x.payload.data))),
      // info(x => x),
      // TE.map(info),
      // alias for flatMapEither: TE.chainEitherK(validateWaypointResponse),
      TE.flatMapEither(validateWaypointResponse),
      TE.map(mapWaypointResponseToWaypoints),
      // TE.map(logger('bar', x => x)),
      // TE.chain((x, y) => right(x)),
      // TE.flatMap(w => Boolean(w) ? right(w) : left(Error('??'))),
      // TE.flatMapEither(foo),
      TE.map((waypoints) =>
        pipe(
          waypoints,
          // IO.tapIO(info),
          // ? T.tapIO(info),
          A.filter(isPlanet),
          // A
          // T.tapIO(info),
          // A.map(info),
          // TODO how to do tapIO(info) in A.map ?
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
