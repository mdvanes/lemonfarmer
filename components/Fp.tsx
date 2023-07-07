import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";

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
): Array<FWaypoint | null> => {
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

  return <div>fp {pipe(1, add1, multiply2)}</div>;
};
