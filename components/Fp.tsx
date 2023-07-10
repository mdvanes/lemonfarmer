import { flow, pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";
import * as A from "fp-ts/Array";

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

  return <div>fp {pipe(1, add1, multiply2)}</div>;
};
